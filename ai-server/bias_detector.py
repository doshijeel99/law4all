import os
import json
from typing import Dict, List, Any, Union
from langchain_groq import ChatGroq
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv


load_dotenv()


class BiasDetector:
    """
    Module for detecting and mitigating bias in legal advice and documents
    """
    
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("GROQ_API_TOKEN")
        if not self.api_key:
            raise ValueError("GROQ_API_TOKEN not found in environment or provided as parameter")
            
        self.llm = ChatGroq(
            api_key=self.api_key,
            model_name="llama3-70b-8192"
        )
        self.bias_prompt = PromptTemplate(
            input_variables=["text"],
            template="""
            Analyze the following legal text for potential biases:
            
            {text}
            
            Please identify any biases related to:
            1. Demographic factors (race, gender, age, socioeconomic status)
            2. Jurisdictional assumptions or preferences
            3. Political or ideological leanings
            4. Language accessibility issues
            
            For each bias identified, provide:
            - A bias score from 1-10 (1 being minimal bias, 10 being highly biased)
            - A specific explanation of the bias
            - A recommendation for how to rewrite the text to reduce this bias
            
            Output your analysis in JSON format.
            """
        )
        self.bias_chain = LLMChain(llm=self.llm, prompt=self.bias_prompt)
    
    def detect_bias(self, text: str) -> Dict[str, Any]:
        """
        Detect potential biases in legal text
        
        Parameters:
        - text: The text to analyze for bias
        
        Returns:
        - Dict containing bias analysis
        """
        try:
            result = self.bias_chain.invoke({"text": text})["text"]
            # Handle case where result might not be valid JSON
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                return {
                    "error": "Failed to parse bias analysis result as JSON",
                    "raw_result": result,
                    "overall_score": 5
                }
        except Exception as e:
            print(f"Error in bias detection: {e}")
            return {
                "error": "Failed to analyze bias",
                "error_details": str(e),
                "overall_score": 5,  # Default middle score
                "biases": []
            }
    
    def mitigate_hallucinations(self, text: str, sources: List[str]) -> Dict[str, Any]:
        """
        Detect and mitigate potential hallucinations in generated legal advice
        
        Parameters:
        - text: The generated legal advice
        - sources: List of source documents used for generation
        
        Returns:
        - Dict with original and corrected text
        """
        # Ensure sources is valid
        if not isinstance(sources, list):
            sources = [str(sources)]
        
        # Make sure all sources are strings
        sources = [str(source) for source in sources]
        
        hallucination_prompt = PromptTemplate(
            input_variables=["text", "sources"],
            template="""
            Review the following legal advice for potential hallucinations or factual inaccuracies:
            
            LEGAL ADVICE:
            {text}
            
            SOURCE DOCUMENTS:
            {sources}
            
            Identify any statements in the legal advice that:
            1. Contradict the source documents
            2. Make claims not supported by the source documents
            3. Cite non-existent statutes, cases, or regulations
            4. Misinterpret legal principles from the source documents
            
            For each potential hallucination, provide:
            - The problematic statement
            - The reason it may be a hallucination
            - A suggestion for correction based on the source documents
            
            If no hallucinations are detected, confirm that the advice appears well-grounded in the provided sources.
            Output your analysis in JSON format.
            """
        )
        
        hallucination_chain = LLMChain(llm=self.llm, prompt=hallucination_prompt)
        
        # Format source documents as string
        sources_text = "\n\n".join([f"SOURCE {i+1}:\n{source}" for i, source in enumerate(sources)])
        
        try:
            result = hallucination_chain.invoke({"text": text, "sources": sources_text})["text"]
            
            # Parse JSON from the result with error handling
            try:
                hallucination_analysis = json.loads(result)
            except json.JSONDecodeError:
                # Handle case where result is not valid JSON
                hallucination_analysis = {
                    "error": "Failed to parse hallucination analysis as JSON",
                    "raw_result": result,
                    "hallucinations_detected": False
                }
            
            # If hallucinations detected, generate corrected version
            if hallucination_analysis.get("hallucinations_detected", False):
                correction_prompt = PromptTemplate(
                    input_variables=["text", "hallucinations"],
                    template="""
                    Revise the following legal advice to correct identified hallucinations:
                    
                    ORIGINAL ADVICE:
                    {text}
                    
                    IDENTIFIED HALLUCINATIONS:
                    {hallucinations}
                    
                    Please provide a corrected version that:
                    1. Removes or corrects any misleading information
                    2. Clearly indicates where information is uncertain or not fully supported
                    3. Maintains a helpful tone while being accurate
                    4. Adds appropriate disclaimers where needed
                    
                    OUTPUT THE CORRECTED ADVICE ONLY.
                    """
                )
                
                correction_chain = LLMChain(llm=self.llm, prompt=correction_prompt)
                
                # Safely convert hallucinations to JSON string
                hallucination_data = hallucination_analysis.get("hallucinations", [])
                if isinstance(hallucination_data, list):
                    hallucinations_str = json.dumps(hallucination_data)
                else:
                    hallucinations_str = json.dumps([{"issue": "Unknown issue detected"}])
                
                corrected_text = correction_chain.invoke({
                    "text": text, 
                    "hallucinations": hallucinations_str
                })["text"]
                
                return {
                    "original_text": text,
                    "corrected_text": corrected_text,
                    "hallucination_analysis": hallucination_analysis
                }
            else:
                return {
                    "original_text": text,
                    "corrected_text": text,  # No changes needed
                    "hallucination_analysis": hallucination_analysis
                }
        except Exception as e:
            print(f"Error in hallucination detection: {e}")
            return {
                "original_text": text,
                "corrected_text": text,
                "error": "Failed to analyze for hallucinations",
                "error_details": str(e)
            }