from pydantic import BaseModel
from typing import List, Dict
from difflib import SequenceMatcher
import json
import logging
from itertools import tee, islice

# JSON file path
JSON_FILE_PATH = "/code/data/updated_docdata.json"  # Ensure this matches your actual file location

# S3 Bucket Configuration
BUCKET_NAME = "legal-docs-sih"
REGION_NAME = "ap-south-1"

# Input model
class QueryRequest(BaseModel):
    query: str

# Load document metadata from the JSON file
def load_metadata(json_file_path: str):
    try:
        with open(json_file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        metadata = [
            {
                "filename": item.get("text"),
                "tags": item.get("metadata", {}).get("title", "").split(", "),
                "category": item.get("metadata", {}).get("category", "").lower(),
            }
            for item in data
        ]
        return metadata
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Metadata JSON file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parsing metadata JSON file.")

# Load the metadata
DOCUMENT_METADATA = load_metadata(JSON_FILE_PATH)

# Helper function for n-grams
def ngrams(words, n):
    iterables = tee(words, n)
    for i, it in enumerate(iterables):
        next(islice(it, i, i), None)
    return [" ".join(gram) for gram in zip(*iterables)]

# Function to calculate match score
def calculate_match_score(query_tokens, tags, category):
    match_score = 0
    matched_tags = []

    # Combine unigrams, bigrams, and trigrams for query
    bigrams = ngrams(query_tokens, 2)
    trigrams = ngrams(query_tokens, 3)
    all_query_terms = query_tokens + bigrams + trigrams

    # Match against tags
    for term in all_query_terms:
        for tag in tags:
            similarity = SequenceMatcher(None, term, tag.lower()).ratio()
            if similarity > 0.9:  # Exact match
                match_score += 5
                matched_tags.append(tag)
            elif similarity > 0.7:  # Close match
                match_score += 3
            elif similarity > 0.5:  # Fuzzy match
                match_score += 1

    # Match against category
    if category:
        for term in all_query_terms:
            similarity = SequenceMatcher(None, term, category).ratio()
            if similarity > 0.9:
                match_score += 6  # Higher weight for category match
            elif similarity > 0.7:
                match_score += 4

    return match_score, list(set(matched_tags))  # Return unique matched tags

# Function to find relevant documents
def find_relevant_documents(query: str, metadata: List[Dict], threshold: float = 5.0, max_results: int = 2):
    query_tokens = query.lower().split()
    results = []

    for doc in metadata:
        tags = [tag.lower() for tag in doc["tags"]]
        category = doc["category"].lower() if doc["category"] else ""

        match_score, matched_tags = calculate_match_score(query_tokens, tags, category)

        if match_score >= threshold:
            results.append({
                "filename": doc["filename"],
                "score": match_score,
                "matched_tags": matched_tags,
                "category": category,
            })

    # Sort by score and number of matched tags
    results = sorted(results, key=lambda x: (x["score"], len(x["matched_tags"])), reverse=True)[:max_results]

    logging.info(f"Query: {query}")
    logging.info(f"Matching Results: {results}")

    return [result["filename"] for result in results]

# Function to generate public URL for a file
def generate_public_url(file_key: str):
    return f"https://{BUCKET_NAME}.s3.{REGION_NAME}.amazonaws.com/{file_key}"
