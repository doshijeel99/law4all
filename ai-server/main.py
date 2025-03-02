# main.py
from fastapi import FastAPI,File, UploadFile, Form, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
from dotenv import load_dotenv
from pydantic import BaseModel
from services.maps_location import extract_coordinates_from_maps_url
from services.gemini_game_flow import get_gemini_response
from services.wellness import process_input
from services.scenariosaga import ScenarioSaga
import base64
from typing import List, Dict
from difflib import SequenceMatcher
import json
import logging
from itertools import tee, islice
import os
import io
import PyPDF2
import aiohttp
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from webdriver_manager.chrome import ChromeDriverManager  # Import webdriver-manager
import time
import base64

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Character(BaseModel):
    name: str
    age: int

class GameResponse(BaseModel):
    scenario: str
    image: Optional[str] = None
    options: List[str]

class OptionChoice(BaseModel):
    option_index: int

class AnalysisResponse(BaseModel):
    summary: str
    final_analysis: str

# JSON file path
JSON_FILE_PATH = "updated_docdata.json"  # Ensure this matches your actual file location

# S3 Bucket Configuration
BUCKET_NAME = "legal-docs-sih"
REGION_NAME = "ap-south-1"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

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

def extract_text(file_bytes: bytes, filename: str) -> str:
    """
    Extracts text from a file. Uses PyPDF2 for PDFs and UTF-8 decoding for text files.
    """
    if filename.lower().endswith('.pdf'):
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            text = "\n".join([page.extract_text() or "" for page in pdf_reader.pages])
            return text.strip() if text else "Error: Unable to extract text."
        except Exception as e:
            return f"Error reading PDF: {e}"
    else:
        try:
            return file_bytes.decode("utf-8")
        except Exception as e:
            return f"Error decoding file: {e}"

def summarize_text(text: str) -> str:
    """Returns a basic summary by truncating to the first 100 words."""
    words = text.split()
    return " ".join(words[:100]) + "..." if len(words) > 100 else text

def build_prompt(summary: str) -> str:
    """Constructs the prompt for the LLM using only the document summary."""
    prompt = f"""Legal Document Analysis:

Document Summary:
{summary}

Task: Provide a plain-language explanation of the legal document. Focus on clarity and conciseness without repeating the summary.
"""
    return prompt

async def call_groq_api(prompt: str) -> str:
    """Calls the Groq API with the legal analysis prompt."""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are an expert legal assistant who provides clear, detailed, and non-redundant explanations."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 1024,
        "temperature": 0.6
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(GROQ_API_URL, headers=headers, json=payload) as resp:
                response_json = await resp.json()
                
                # 🔥 DEBUG PRINT
                print("Groq API Full Response:", response_json)

                return response_json.get("choices", [{}])[0].get("message", {}).get("content", "No output generated.")
    except Exception as e:
        return f"Error calling Groq API: {e}"



@app.post("/ai-game-path")
async def ai_financial_path(
    input: str = Form(...),
    risk: Optional[str] = Form("conservative")
):
    """Generates an AI-based financial planning response."""
    try:
        response = get_gemini_response(input, risk)  
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")

@app.post("/extract_coordinates")
async def extract_coordinates(url: str = Form(...)):
    """Extracts coordinates from a Google Maps URL."""
    try:
        coordinates = await extract_coordinates_from_maps_url(url)
        return JSONResponse(content=coordinates, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/ai-chatbot")
async def ai_chatbot(input: str = Form(...), type: str = Form("chatbot")):
    response = process_input(input, type)  # Await the response

    return response

@app.post("/get-documents")
async def get_documents(request: QueryRequest):
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")

    # Find relevant documents
    matches = find_relevant_documents(query, DOCUMENT_METADATA)
    if not matches:
        raise HTTPException(status_code=404, detail="No relevant documents found.")

    # Generate public URLs for matching documents
    links = [generate_public_url(filename) for filename in matches]
    return {"documents": links}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_document(file: UploadFile = File(...)):
    """Analyzes a legal document and provides a summarized plain-language explanation."""
    file_bytes = await file.read()
    text = extract_text(file_bytes, file.filename)
    
    summary = summarize_text(text)
    prompt = build_prompt(summary)
    final_analysis = await call_groq_api(prompt)
    
    return AnalysisResponse(summary=summary, final_analysis=final_analysis)


def initialize_driver():
    global driver
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration
    chrome_options.add_argument("--no-sandbox")  # Required for running in some environments
    chrome_options.add_argument("--window-size=1920,1080")  # Set window size for headless mode

    # Use webdriver-manager to automatically download and manage ChromeDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

@app.get("/")
async def fetch_captcha():
    """Fetch the CAPTCHA image from the target website."""
    try:
        initialize_driver()
        # Open the target website
        driver.get("https://services.ecourts.gov.in/ecourtindia_v6/")
        time.sleep(5)  # Allow the page to load

        # Capture the CAPTCHA image
        captcha_element = driver.find_element(By.ID, "captcha_image")
        captcha_image_data = captcha_element.screenshot_as_png  # Capture screenshot as PNG data
        captcha_base64 = base64.b64encode(captcha_image_data).decode("utf-8")  # Convert to base64

        return JSONResponse(content={"captcha_base64": captcha_base64})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/submit")
async def submit(cino: str = Form(...), captcha: str = Form(...)):
    """Automate form filling and retrieve results."""
    global driver
    try:
        if not cino or not captcha:
            raise HTTPException(status_code=400, detail="CNR number or CAPTCHA is missing.")

        # Debug: Print the page source to check if elements are present
        print(driver.page_source)

        # Automate form submission
        cnr_input = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.NAME, "cino"))
        )
        cnr_input.clear()
        cnr_input.send_keys(cino)

        # Wait for the CAPTCHA input field to be present and interactable
        captcha_input = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.ID, "fcaptcha_code"))
        )
        captcha_input.clear()
        captcha_input.send_keys(captcha)

        # Click the search button
        search_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.ID, "searchbtn"))
        )
        search_button.click()

        time.sleep(10)  # Increase sleep time to ensure dynamic content loads

        # Scrape the result
        result_element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "history_cnr"))
        )
        result_text = result_element.text

        return JSONResponse(content={"success": True, "result": result_text})

    except TimeoutException:
        raise HTTPException(status_code=500, detail="Timeout: Element not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))