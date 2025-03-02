import os
import json
import re
import logging
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from transformers.pipelines import Pipeline
from peft import PeftModel
from dotenv import load_dotenv
from bias_detector import BiasDetector

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("LegalChatbot")

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LegalQuery(BaseModel):
    query: str
    user_constraints: Dict[str, str] = {}

class LegalResponse(BaseModel):
    advice: str
    sources: List[str]
    legal_pathway: Dict[str, List[str]]
    bias_report: Dict
    adr_options: List[str]

class LegalDocument(BaseModel):
    content: str
    metadata: Dict[str, Any] = {}

class LegalChatbot:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_TOKEN")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_TOKEN environment variable not set")
        
        self.bias_detector = BiasDetector(api_key=self.groq_api_key)
        self.models = self._initialize_models()
        
        # Initialize RAG components
        self.embeddings = self._initialize_embeddings()
        self.vector_stores = self._initialize_vector_stores()
        
        # Initialize agent components
        self.agent_executors = self._initialize_agents()

        # Define legal keywords for filtering non-legal queries
        self.legal_keywords = [
            "law", "legal", "court", "rights", "lawsuit", "sue", "attorney", "lawyer", 
            "judge", "criminal", "civil", "plaintiff", "defendant", "case", "trial", 
            "verdict", "settlement", "appeal", "contract", "tort", "damages", "liability",
            "statute", "regulation", "constitution", "amendment", "prosecution", "defense",
            "charge", "bail", "warrant", "injunction", "jurisdiction", "mediation", "arbitration",
            "divorce", "custody", "property", "bankruptcy", "will", "trust", "estate", "probate",
            "copyright", "patent", "trademark", "immigration", "visa", "asylum", "deportation",
            "tax", "irs", "income", "audit", "refund", "deduction", "employment", "wrongful",
            "discrimination", "harassment", "compensation", "rent", "lease", "eviction", "tenant",
            "landlord", "mortgage", "foreclosure"
        ]
        
        logger.info("LegalChatbot initialized successfully with RAG and Agents" )

    def _initialize_models(self) -> Dict[str, Any]:
        """Initialize legal models with error handling"""
        try:
            return {
                "usa": self._load_legal_model("nlpaueb/legal-bert-base-uncased"),
                "uk": self._load_legal_model("nlpaueb/legal-bert-base-uncased"),
                "india": self._load_indian_model(),
                "default": ChatGroq(
                    api_key=self.groq_api_key,
                    model_name="llama3-70b-8192"
                )
            }
        except Exception as e:
            logger.error(f"Model initialization failed: {str(e)}")
            raise

    def _initialize_embeddings(self):
        """Initialize embeddings model for RAG"""
        try:
            return HuggingFaceEmbeddings(
                model_name="nlpaueb/legal-bert-base-uncased"
            )
        except Exception as e:
            logger.error(f"Embeddings initialization failed: {str(e)}")
            raise

    def _initialize_vector_stores(self):
        """Initialize vector stores for different jurisdictions"""
        try:
            # In a real implementation, you would load documents from various sources
            # and create proper vector stores for each jurisdiction
            vector_stores = {}
            
            # Sample documents for demonstration - in production, load real legal documents
            jurisdictions = ["usa", "uk", "india"]
            
            for jurisdiction in jurisdictions:
                # Path to jurisdiction-specific documents
                docs_path = f"./legal_docs/{jurisdiction}"
                
                # Create empty vector store if documents don't exist yet
                if not os.path.exists(docs_path):
                    vector_stores[jurisdiction] = FAISS.from_texts(
                        ["Placeholder legal text for " + jurisdiction], 
                        self.embeddings,
                        metadatas=[{"jurisdiction": jurisdiction, "source": "placeholder"}]
                    )
                    # Save empty index for future use
                    os.makedirs(docs_path, exist_ok=True)
                    vector_stores[jurisdiction].save_local(f"{docs_path}/index")
                else:
                    # Load existing index
                    vector_stores[jurisdiction] = FAISS.load_local(
                        f"{docs_path}/index", 
                        self.embeddings
                    )
            
            return vector_stores
        
        except Exception as e:
            logger.error(f"Vector store initialization failed: {str(e)}")
            # Fall back to empty dictionary if vector stores fail
            return {}

    def _initialize_agents(self):
        """Initialize specialized legal agents for different tasks"""
        agent_executors = {}
        
        try:
            default_llm = self.models["default"]
            
            # Define tools for the agents
            legal_research_tool = Tool(
                name="LegalResearch",
                func=self._legal_research_tool,
                description="Search for relevant legal information in our database."
            )
            
            pathway_analysis_tool = Tool(
                name="PathwayAnalysis",
                func=self._pathway_analysis_tool,
                description="Generate a step-by-step legal pathway for a given situation."
            )
            
            adr_analysis_tool = Tool(
                name="ADRAnalysis",
                func=self._adr_analysis_tool,
                description="Analyze alternative dispute resolution options for a given case."
            )
            
            # Create the agent prompt
            agent_prompt = PromptTemplate.from_template(
                """You are a specialized legal assistant. Answer the following query using the tools available to you:
                
                {query}
                
                Think step by step about the best approach. Use the most relevant tool for the job.
                
                {agent_scratchpad}
                """
            )
            
            # Create agent with tools
            agent = create_react_agent(
                default_llm,
                [legal_research_tool, pathway_analysis_tool, adr_analysis_tool],
                agent_prompt
            )
            
            # Create agent executor
            agent_executors["default"] = AgentExecutor(
                agent=agent,
                tools=[legal_research_tool, pathway_analysis_tool, adr_analysis_tool],
                verbose=True
            )
            
            return agent_executors
            
        except Exception as e:
            logger.error(f"Agent initialization failed: {str(e)}")
            return {}

    def _legal_research_tool(self, query: str):
        """Tool for retrieving relevant legal information"""
        try:
            # Detect jurisdiction for the query
            jurisdiction = self._detect_jurisdiction(query)
            
            # Get the appropriate vector store
            vector_store = self.vector_stores.get(jurisdiction)
            if not vector_store:
                return "No relevant legal documents found for this jurisdiction."
            
            # Create retriever with appropriate search parameters
            retriever = vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3}
            )
            
            # Get relevant documents
            docs = retriever.invoke(query)
            
            # Extract and format results
            results = []
            for doc in docs:
                results.append({
                    "content": doc.page_content,
                    "source": doc.metadata.get("source", "Unknown source"),
                    "relevance": doc.metadata.get("score", 0)
                })
            
            return json.dumps(results, indent=2)
            
        except Exception as e:
            logger.error(f"Legal research tool error: {str(e)}")
            return "Error performing legal research."

    def _pathway_analysis_tool(self, query: str):
        """Tool for generating legal pathways"""
        try:
            jurisdiction = self._detect_jurisdiction(query)
            return self._generate_legal_pathway(query, jurisdiction, {})
        except Exception as e:
            logger.error(f"Pathway analysis tool error: {str(e)}")
            return "Error generating legal pathway."

    def _adr_analysis_tool(self, query: str):
        """Tool for analyzing ADR options"""
        try:
            jurisdiction = self._detect_jurisdiction(query)
            response = self._generate_legal_response(query, jurisdiction)
            return self._identify_adr_options(response, jurisdiction)
        except Exception as e:
            logger.error(f"ADR analysis tool error: {str(e)}")
            return "Error analyzing ADR options."
        
    def _load_legal_model(self, model_name: str):
        """Load legal model with proper configuration"""
        try:
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(model_name)
            return pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                max_new_tokens=100,
                do_sample=True,
                temperature=0.7,
                device_map="auto"
            )
        except Exception as e:
            logger.error(f"Failed to load {model_name}: {str(e)}")
            raise

    def _load_indian_model(self):
        """Load and configure Indian legal model"""
        try:
            base_model = AutoModelForCausalLM.from_pretrained(
                "unsloth/llama-3.2-1b-instruct-bnb-4bit"
            )
            model = PeftModel.from_pretrained(base_model, "jeeldoshi/model_1b_final")
            tokenizer = AutoTokenizer.from_pretrained(
                "unsloth/llama-3.2-1b-instruct-bnb-4bit"
            )
            return pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                device_map="auto"
            )
        except Exception as e:
            logger.error(f"Indian model load failed: {str(e)}")
            raise
    
    def _is_legal_query(self, query: str) -> bool:
        """Check if query is related to legal topics"""
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in self.legal_keywords)

    async def process_query(self, query: str, constraints: Dict) -> LegalResponse:
        """Process legal query with RAG and Agent-based approach"""
        try:
            if not query.strip():
                raise HTTPException(status_code=400, detail="Empty query")
            
            # Check if query is legal-related
            if not self._is_legal_query(query):
                return LegalResponse(
                    advice="I can only answer legal-related questions. Please provide a query related to legal topics.",
                    sources=[],
                    legal_pathway={"steps": [], "resources": []},
                    bias_report={},
                    adr_options=[]
                )

            # Detect jurisdiction and query type
            jurisdiction = self._detect_jurisdiction(query)
            query_type = self._detect_query_type(query)
            
            logger.info(f"Processing {query_type} query for {jurisdiction} jurisdiction")
            
            # Use agent to decide approach and gather information
            agent_executor = self.agent_executors.get("default")
            
            if agent_executor:
                agent_response = agent_executor.invoke({"query": query})
                sources = self._extract_sources_from_agent(agent_response, query, jurisdiction)
                
                # Construct response based on agent output and query type
                if query_type == "static":
                    return await self._handle_static_query(query, jurisdiction, agent_response, sources)
                elif query_type == "how_to":
                    return await self._handle_how_to_query(query, jurisdiction, agent_response, sources)
                elif query_type == "pathway":
                    return await self._handle_pathway_query(query, jurisdiction, constraints, agent_response)
                elif query_type == "adr":
                    return await self._handle_adr_query(query, jurisdiction, agent_response)
                else:
                    return await self._handle_general_query(query, jurisdiction, agent_response, sources)
            else:
                # Fallback to original approach if agent isn't available
                return await self._legacy_process_query(query, constraints)
                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Processing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

    def _extract_sources_from_agent(self, agent_response: Dict, query: str, jurisdiction: str) -> List[str]:
        """Extract sources from agent response"""
        sources = []
        try:
            # Look for legal research tool output which might contain sources
            if "LegalResearch" in str(agent_response):
                agent_output = agent_response.get("output", "")
                results_start = agent_output.find("[")
                results_end = agent_output.rfind("]") + 1
                
                if results_start >= 0 and results_end > results_start:
                    json_str = agent_output[results_start:results_end]
                    results = json.loads(json_str)
                    
                    for result in results:
                        if "source" in result and result["source"] not in sources:
                            sources.append(result["source"])
        except Exception as e:
            logger.warning(f"Error extracting sources: {str(e)}")
        
        # If no sources could be extracted, return default sources using the query and jurisdiction
        if not sources:
            return [
                f"Legal Database Reference #LC-{jurisdiction.upper()}-{hash(query) % 1000:03d}",
                f"Legal Precedent Collection #{hash(query) % 500:03d}"
            ]
            
        return sources

    async def _handle_static_query(self, query, jurisdiction, agent_response, sources):
        """Handle static legal queries with RAG"""
        try:
            response = agent_response.get("output", "")
            validated_response = self._validate_response(query, response, jurisdiction)
            summarized_response = self._summarize_response(validated_response)
            
            return LegalResponse(
                advice=summarized_response,
                sources=sources,
                legal_pathway={"steps": [], "resources": []},
                bias_report={},
                adr_options=[]
            )
        except Exception as e:
            logger.error(f"Static query handling error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing static query")

    async def _handle_how_to_query(self, query, jurisdiction, agent_response, sources):
        """Handle how-to procedural queries"""
        try:
            response = agent_response.get("output", "")
            validated_response = self._validate_response(query, response, jurisdiction)
            concise_guide = self._create_concise_guide(validated_response)
            
            return LegalResponse(
                advice=concise_guide,
                sources=sources,
                legal_pathway={"steps": [], "resources": []},
                bias_report={},
                adr_options=[]
            )
        except Exception as e:
            logger.error(f"How-to query handling error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing how-to query")

    async def _handle_pathway_query(self, query, jurisdiction, constraints, agent_response):
        """Handle legal pathway queries"""
        try:
            pathway_data = self._extract_pathway_from_agent(agent_response)
            resources = self._get_pro_bono_resources(jurisdiction)
            
            return LegalResponse(
                advice="",
                sources=[],
                legal_pathway={"steps": pathway_data, "resources": resources},
                bias_report={},
                adr_options=[]
            )
        except Exception as e:
            logger.error(f"Pathway query handling error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing pathway query")

    async def _handle_adr_query(self, query, jurisdiction, agent_response):
        """Handle ADR-related queries"""
        try:
            adr_options = self._extract_adr_from_agent(agent_response)
            
            return LegalResponse(
                advice="",
                sources=[],
                legal_pathway={"steps": [], "resources": []},
                bias_report={},
                adr_options=adr_options
            )
        except Exception as e:
            logger.error(f"ADR query handling error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing ADR query")

    async def _handle_general_query(self, query, jurisdiction, agent_response, sources):
        """Handle general legal queries"""
        try:
            response = agent_response.get("output", "")
            validated_response = self._validate_response(query, response, jurisdiction)
            concise_response = self._create_concise_response(validated_response)
            
            return LegalResponse(
                advice=concise_response,
                sources=sources,
                legal_pathway={"steps": [], "resources": []},
                bias_report={},
                adr_options=[]
            )
        except Exception as e:
            logger.error(f"General query handling error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing general query")

    def _detect_query_type(self, query: str) -> str:
        """Detect the type of legal query"""
        query_lower = query.lower()
        
        if (query_lower.startswith("what is") or 
            query_lower.startswith("what are") or 
            query_lower.startswith("define") or
            "meaning of" in query_lower or
            "definition of" in query_lower or
            "explain" in query_lower):
            return "static"
        elif (query_lower.startswith("how to") or 
              query_lower.startswith("how do i") or
              query_lower.startswith("how can i") or
              query_lower.startswith("what's the process") or
              query_lower.startswith("what is the process") or
              "steps to" in query_lower or
              "procedure for" in query_lower or
              "guide to" in query_lower):
            return "how_to"
        elif any(keyword in query_lower for keyword in ["pathway", "roadmap", "steps", "process", "timeline"]):
            return "pathway"
        elif any(keyword in query_lower for keyword in ["adr", "alternative dispute", "mediation", "arbitration", "resolution"]):
            return "adr"
        return "general"

    def _extract_pathway_from_agent(self, agent_response: Dict) -> List[str]:
        """Extract pathway steps from agent response"""
        pathway_steps = []
        try:
            output = agent_response.get("output", "")
            lines = output.split("\n")
            for line in lines:
                line = line.strip()
                if re.match(r"^\d+\.\s+", line) or re.match(r"^[•\-\*]\s+", line):
                    step = re.sub(r"^[\d\.\-\*•]+\s+", "", line)
                    pathway_steps.append(step)
            if not pathway_steps:
                sentences = re.split(r'(?<=[.!?])\s+', output)
                for sentence in sentences:
                    if len(sentence) > 10 and sentence.strip():
                        pathway_steps.append(sentence.strip())
        except Exception as e:
            logger.warning(f"Error extracting pathway: {str(e)}")
        
        return pathway_steps[:10]

    def _extract_adr_from_agent(self, agent_response: Dict) -> List[str]:
        """Extract ADR options from agent response"""
        adr_options = []
        try:
            output = agent_response.get("output", "")
            adr_keywords = ["mediation", "arbitration", "negotiation", "conciliation", 
                           "settlement conference", "neutral evaluation", "mini-trial", 
                           "summary jury trial", "private judging", "dispute resolution"]
            lines = output.split("\n")
            for line in lines:
                line = line.strip()
                for keyword in adr_keywords:
                    if keyword in line.lower():
                        adr_options.append(line)
                        break
            if not adr_options:
                sentences = re.split(r'(?<=[.!?])\s+', output)
                for sentence in sentences:
                    for keyword in adr_keywords:
                        if keyword in sentence.lower():
                            adr_options.append(sentence.strip())
                            break
        except Exception as e:
            logger.warning(f"Error extracting ADR options: {str(e)}")
        
        return list(set(adr_options))[:5]

    def _summarize_response(self, response: str) -> str:
        """Create a concise summary of a legal response"""
        try:
            prompt = f"""Summarize this legal information in 2-3 concise paragraphs, focusing on the most important points:
            
{response}"""
            summary = self.models["default"].invoke(prompt).content
            return summary
        except Exception as e:
            logger.warning(f"Summarization error: {str(e)}")
            return response[:250] + "..."

    def _create_concise_guide(self, response: str) -> str:
        """Create a concise step-by-step guide from a how-to response"""
        try:
            prompt = f"""Convert this how-to legal information into a concise, numbered list of steps (max 8 steps):
            
{response}"""
            guide = self.models["default"].invoke(prompt).content
            return guide
        except Exception as e:
            logger.warning(f"Guide creation error: {str(e)}")
            return response

    def _create_concise_response(self, response: str) -> str:
        """Create a concise version of a general legal response"""
        try:
            prompt = f"""Rewrite this legal advice in a more concise form (max 150 words), focusing on the most important points:
            
{response}"""
            concise = self.models["default"].invoke(prompt).content
            return concise
        except Exception as e:
            logger.warning(f"Concise response creation error: {str(e)}")
            return response[:300] + "..."

    async def index_legal_document(self, document: LegalDocument, jurisdiction: str):
        """Index a legal document for RAG"""
        try:
            content = document.content
            metadata = document.metadata
            metadata["jurisdiction"] = jurisdiction
            
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=100
            )
            splits = text_splitter.split_text(content)
            
            if jurisdiction in self.vector_stores:
                vector_store = self.vector_stores[jurisdiction]
            else:
                vector_store = FAISS.from_texts([], self.embeddings)
                self.vector_stores[jurisdiction] = vector_store
            
            for i, split in enumerate(splits):
                split_metadata = metadata.copy()
                split_metadata["chunk"] = i
                vector_store.add_texts([split], [split_metadata])
            
            docs_path = f"./legal_docs/{jurisdiction}"
            os.makedirs(docs_path, exist_ok=True)
            vector_store.save_local(f"{docs_path}/index")
            
            return {"status": "success", "chunks_indexed": len(splits)}
            
        except Exception as e:
            logger.error(f"Document indexing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Document indexing failed: {str(e)}")

    def _is_static_legal_query(self, query: str) -> bool:
        """Detect if the query is a static legal question"""
        query_lower = query.lower()
        return (query_lower.startswith("what is") or 
                query_lower.startswith("what are") or 
                query_lower.startswith("define") or
                "meaning of" in query_lower or
                "definition of" in query_lower or
                "explain" in query_lower)
    
    def _is_how_to_query(self, query: str) -> bool:
        """Detect if the query is a procedural how-to question"""
        query_lower = query.lower()
        return (query_lower.startswith("how to") or 
                query_lower.startswith("how do i") or
                query_lower.startswith("how can i") or
                query_lower.startswith("what's the process") or
                query_lower.startswith("what is the process") or
                "steps to" in query_lower or
                "procedure for" in query_lower or
                "guide to" in query_lower)
    
    def _get_static_legal_answer(self, query: str, jurisdiction: str) -> str:
        """Get factual information for static legal queries"""
        try:
            prompt = f"""Provide a clear, factual explanation for the following legal question for {jurisdiction} jurisdiction:
            
{query}

Provide only verified information with proper context. Focus on established legal principles, constitutional provisions, or statutory laws without speculation. Include key legal references where applicable."""
            response = self.models["default"].invoke(prompt).content
            return response
        except Exception as e:
            logger.error(f"Static legal answer generation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Answer generation failed: {str(e)}")
    
    def _generate_how_to_response(self, query: str, jurisdiction: str) -> str:
        """Generate a response for how-to legal queries"""
        try:
            prompt = f"""Provide a general step-by-step guide for the following legal procedure in {jurisdiction} jurisdiction:
            
{query}

Include:
1. Initial considerations and prerequisites
2. Required documentation
3. Filing procedures or formal steps
4. Expected timeline
5. Potential costs
6. When professional legal assistance is recommended

Focus on providing general process information without speculation, using verified legal procedures. Emphasize that this is general guidance and specific cases may vary."""
            response = self.models["default"].invoke(prompt).content
            return response
        except Exception as e:
            logger.error(f"How-to response generation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Response generation failed: {str(e)}")

    def _detect_jurisdiction(self, query: str) -> str:
        """More robust jurisdiction detection"""
        prompt = f"""Analyze this legal query and return ONLY the jurisdiction code (usa, uk, india):
Query: {query}
Answer must be exactly one of: usa, uk, india, or default"""
        try:
            response = self.models["default"].invoke(prompt).content
            clean_response = response.strip().lower()
            patterns = [
                (r"\b(usa|united\s?states)\b", "usa"),
                (r"\b(uk|united\s?kingdom)\b", "uk"),
                (r"\b(india|indian)\b", "india")
            ]
            for pattern, code in patterns:
                if re.search(pattern, clean_response):
                    return code
            return "default"
        except Exception as e:
            logger.warning(f"Jurisdiction detection fallback: {str(e)}")
            return "default"

    def _generate_legal_response(self, query: str, jurisdiction: str) -> str:
        """Generate response with proper type checking"""
        try:
            model = self.models.get(jurisdiction, self.models["default"])
            prompt = self._create_legal_prompt(query, jurisdiction)
            
            if isinstance(model, Pipeline):
                result = model(
                    prompt, 
                    max_length=1000,
                    truncation=True
                )[0]['generated_text']
            elif hasattr(model, "invoke"):
                result = model.invoke(prompt).content
            else:
                raise ValueError(f"Unsupported model type: {type(model)}")
                
            return result
        except Exception as e:
            logger.error(f"Response generation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Response generation failed: {str(e)}")

    def _validate_response(self, query: str, response: str, jurisdiction: str) -> str:
        """Validate and mitigate hallucinations"""
        try:
            validation_prompt = f"""Review this legal response for factual accuracy and potential hallucinations:
            
Query: {query}
Response: {response}

If you find any potential inaccuracies, generalized claims without proper legal basis, or speculative statements, please correct them. Be particularly careful with specific laws, cases, and procedures. If information seems questionable, qualify it appropriately. Return the corrected response."""
            validation_result = self.models["default"].invoke(validation_prompt).content
            if not validation_result or len(validation_result.strip()) < 50:
                return response
            return validation_result
        except Exception as e:
            logger.warning(f"Validation error: {str(e)}")
            return response

    def _create_legal_prompt(self, query: str, jurisdiction: str) -> str:
        """Create structured legal prompt"""
        return f"""As an unbiased {jurisdiction} legal assistant, provide:
1. Analysis of: {query}
2. Relevant citations
3. Pro bono resources
4. ADR options
Use clear headings and bullet points."""

    def _retrieve_sources(self, query: str, jurisdiction: str) -> List[str]:
        """Retrieve legal sources (mock implementation)"""
        return [
            f"{jurisdiction.upper()} Legal Code §2023.123",
            f"{jurisdiction.upper()} Court Decision 2023-CV-456"
        ]

    def _generate_legal_pathway(self, query: str, jurisdiction: str, constraints: Dict) -> Dict[str, List[str]]:
        """Generate legal pathway with validation"""
        try:
            prompt = f"""Create legal roadmap for {jurisdiction}:
Case: {query}
Constraints: {json.dumps(constraints)}
Include steps, documents, pro bono options, and ADR timeline."""
            response = self.models["default"].invoke(prompt).content
            return {
                "steps": [s.strip() for s in response.split("\n") if s.strip()],
                "resources": self._get_pro_bono_resources(jurisdiction)
            }
        except Exception as e:
            logger.error(f"Pathway generation failed: {str(e)}")
            return {"steps": [], "resources": []}

    def _identify_adr_options(self, response: str, jurisdiction: str) -> List[str]:
        """Extract ADR options with validation"""
        try:
            prompt = f"""Extract ADR options from this {jurisdiction} text:
{response}
Return as comma-separated list"""
            result = self.models["default"].invoke(prompt).content
            return [o.strip() for o in result.split(",") if o.strip()]
        except Exception as e:
            logger.warning(f"ADR extraction failed: {str(e)}")
            return []

    def _get_pro_bono_resources(self, jurisdiction: str) -> List[str]:
        """Get pro bono resources"""
        return [
            f"{jurisdiction.upper()} Legal Aid Foundation",
            f"{jurisdiction.upper()} Pro Bono Network"
        ]

    async def _legacy_process_query(self, query: str, constraints: Dict) -> LegalResponse:
        """Fallback processing using legacy methods when agent is unavailable"""
        jurisdiction = self._detect_jurisdiction(query)
        query_type = self._detect_query_type(query)
        
        if query_type == "static":
            response = self._get_static_legal_answer(query, jurisdiction)
        elif query_type == "how_to":
            response = self._generate_how_to_response(query, jurisdiction)
        else:
            response = self._generate_legal_response(query, jurisdiction)
        
        sources = self._retrieve_sources(query, jurisdiction)
        
        return LegalResponse(
            advice=response,
            sources=sources,
            legal_pathway={"steps": [], "resources": []},
            bias_report={},
            adr_options=[]
        )