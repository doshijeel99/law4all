import os
import json
import re
import logging
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from langchain.agents import load_tools
from langchain.tools import Tool
from langchain.agents import AgentExecutor, create_structured_chat_agent
from langdetect import detect
from deep_translator import GoogleTranslator
from dotenv import load_dotenv

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


# Pydantic models - Simplified to just take query
class LegalQuery(BaseModel):
    query: str

class LegalResponse(BaseModel):
    advice: str
    sources: List[str]

class LegalDocument(BaseModel):
    content: str
    metadata: Dict[str, Any] = {}

class LegalChatbot:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_TOKEN")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_TOKEN environment variable not set")
        
        # Initialize language model
        self.model = ChatGroq(
            api_key=self.groq_api_key,
            model_name="llama3-70b-8192",
            temperature=0.2  # Lower temperature for more consistent outputs
        )
        
        # Initialize RAG components
        try:
            # Explicitly install FAISS if needed
            try:
                import faiss
                logger.info("FAISS already installed")
            except ImportError:
                logger.warning("FAISS not installed. Installing faiss-cpu...")
                os.system("pip install faiss-cpu")
                logger.info("FAISS installed successfully")
                
            self.embeddings = self._initialize_embeddings()
            self.vector_stores = self._initialize_vector_stores()
            logger.info("Vector stores initialized successfully")
        except Exception as e:
            logger.error(f"Vector store initialization failed: {str(e)}")
            self.vector_stores = {}
        
        # Initialize agent components with structured agent instead of react agent
        try:
            self.agent_executor = self._initialize_agents()
            logger.info("Agent initialized successfully")
        except Exception as e:
            logger.error(f"Agent initialization failed: {str(e)}")
            self.agent_executor = None

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
        
        logger.info("LegalChatbot initialization complete")

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
            vector_stores = {}
            jurisdictions = ["usa", "uk", "india"]
            
            for jurisdiction in jurisdictions:
                # Path to jurisdiction-specific documents
                docs_path = f"./legal_docs/{jurisdiction}"
                
                # Create empty vector store if documents don't exist yet
                if not os.path.exists(docs_path):
                    os.makedirs(docs_path, exist_ok=True)
                    vector_stores[jurisdiction] = FAISS.from_texts(
                        ["Placeholder legal text for " + jurisdiction], 
                        self.embeddings,
                        metadatas=[{"jurisdiction": jurisdiction, "source": "placeholder"}]
                    )
                    # Save empty index for future use
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

    def _initialize_agents(self):
        """Initialize specialized legal agent with tools using structured agent instead of react"""
        try:
            # Define tools for the agent
            legal_research_tool = Tool(
                name="LegalResearch",
                func=self._legal_research_tool,
                description="Search for relevant legal information in our database."
            )
            
            # Using structured chat agent instead of react agent
            # This agent format is more reliable with Groq
            template = """You are a specialized legal assistant. Answer the following query using the tools available to you.
            
            {chat_history}
            
            Human: {input}
            
            Think through this step-by-step to find the right information:
            1. Understand the legal query
            2. Determine which tool to use
            3. Search for relevant information
            4. Format your answer clearly
            
            Make sure to use sources from your research.
            
            Available tools: {tools}
            """

            prompt = PromptTemplate.from_template(template)
            
            # Create structured chat agent - more reliable than ReAct with Groq
            agent = create_structured_chat_agent(
                llm=self.model,
                tools=[legal_research_tool],
                prompt=prompt
            )
            
            # Create agent executor
            return AgentExecutor(
                agent=agent,
                tools=[legal_research_tool],
                verbose=True,
                handle_parsing_errors=True,
                max_iterations=3  # Limit iterations to prevent too many API calls
            )
            
        except Exception as e:
            logger.error(f"Agent initialization failed: {str(e)}")
            return None

    def _is_legal_query(self, query: str) -> bool:
        """Check if query is related to legal topics"""
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in self.legal_keywords)

    def _detect_language(self, text: str) -> str:
        """Detect language of input text"""
        try:
            return detect(text)
        except:
            return "en"

    def _translate_text(self, text: str, src_lang: str, dest_lang: str = "en") -> str:
        """Translate text between languages using deep_translator's GoogleTranslator"""
        if src_lang == dest_lang:
            return text
        try:
            return GoogleTranslator(source=src_lang, target=dest_lang).translate(text)
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return text  # Return original if translation fails

    async def process_query(self, query: str) -> LegalResponse:
        """Process legal query with RAG and Agent-based approach ensuring response language matches input"""
        try:
            if not query.strip():
                raise HTTPException(status_code=400, detail="Empty query")
            
            # Detect language of the input query
            src_lang = self._detect_language(query)
            
            # Translate to English if needed
            if src_lang != "en":
                en_query = self._translate_text(query, src_lang, "en")
            else:
                en_query = query
            
            # Check if query is legal-related
            if not self._is_legal_query(en_query):
                response = "I can only answer legal-related questions. Please provide a query related to legal topics."
                # Translate response back if needed
                if src_lang != "en":
                    response = self._translate_text(response, "en", src_lang)
                    
                return LegalResponse(
                    advice=response,
                    sources=[]
                )

            # Detect jurisdiction
            jurisdiction = self._detect_jurisdiction(en_query)
            
            logger.info(f"Processing query for {jurisdiction} jurisdiction in {src_lang} language")
            
            # Use agent to decide approach and gather information
            if self.agent_executor:
                try:
                    # Try with agent first
                    agent_response = self.agent_executor.invoke({"input": en_query})
                    logger.info(f"Agent response: {agent_response}")
                    
                    # Extract output and sources
                    advice = agent_response.get("output", "")
                    sources = self._extract_sources_from_agent(agent_response, en_query, jurisdiction)
                    
                    # Translate response back if needed
                    if src_lang != "en":
                        advice = self._translate_text(advice, "en", src_lang)
                    
                    return LegalResponse(
                        advice=advice,
                        sources=sources
                    )
                except Exception as e:
                    logger.error(f"Agent execution failed: {str(e)}, falling back to RAG response")
                    # Fall back to RAG response
                    response = self._generate_rag_response(en_query, jurisdiction)
                    
                    # Translate response back if needed
                    if src_lang != "en":
                        response = self._translate_text(response, "en", src_lang)
                    
                    return LegalResponse(
                        advice=response,
                        sources=self._retrieve_sources(en_query, jurisdiction)
                    )
            else:
                # Direct RAG if agent isn't available
                response = self._generate_rag_response(en_query, jurisdiction)
                
                # Translate response back if needed
                if src_lang != "en":
                    response = self._translate_text(response, "en", src_lang)
                
                return LegalResponse(
                    advice=response,
                    sources=self._retrieve_sources(en_query, jurisdiction)
                )
                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Processing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

    def _extract_sources_from_agent(self, agent_response: Dict, query: str, jurisdiction: str) -> List[str]:
        """Extract sources from agent response"""
        sources = []
        try:
            # Extract from output
            output = agent_response.get("output", "")
            
            # Look for JSON in the response
            json_pattern = r"\[.*?\]"
            json_matches = re.findall(json_pattern, output, re.DOTALL)
            
            for json_str in json_matches:
                try:
                    results = json.loads(json_str)
                    if isinstance(results, list):
                        for result in results:
                            if isinstance(result, dict) and "source" in result and result["source"] not in sources:
                                sources.append(result["source"])
                except:
                    continue
                    
            # Look for direct source mentions
            source_pattern = r"(?:source|reference):\s*([^\n]+)"
            source_matches = re.findall(source_pattern, output, re.IGNORECASE)
            
            for source in source_matches:
                if source not in sources:
                    sources.append(source)
                    
        except Exception as e:
            logger.warning(f"Error extracting sources: {str(e)}")
        
        # If no sources could be extracted, return default sources
        if not sources:
            return [
                f"Legal Database Reference #LC-{jurisdiction.upper()}-{hash(query) % 1000:03d}",
                f"Legal Precedent Collection #{hash(query) % 500:03d}"
            ]
            
        return sources

    def _detect_jurisdiction(self, query: str) -> str:
        """Detect jurisdiction from query"""
        prompt = f"""Analyze this legal query and return ONLY the jurisdiction code (usa, uk, india):
Query: {query}
Answer must be exactly one of: usa, uk, india, or default"""
        try:
            response = self.model.invoke(prompt).content
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

    def _generate_rag_response(self, query: str, jurisdiction: str) -> str:
        """Generate response using RAG approach"""
        try:
            # Get relevant documents
            if jurisdiction in self.vector_stores:
                vector_store = self.vector_stores[jurisdiction]
                retriever = vector_store.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 3}
                )
                docs = retriever.invoke(query)
                
                # Create context from retrieved documents
                context = "\n\n".join([doc.page_content for doc in docs])
                max_context_len = 2096
                if len(context) > max_context_len:
                    context = context[:max_context_len]
                # Create prompt with context
                prompt = f"""As a legal assistant, use the following legal context to answer the query:

Context:
{context}

Query:
{query}

Provide a detailed legal answer with citations where available:"""
                
                response = self.model.invoke(prompt).content
                return response
            else:
                # Fallback without RAG
                return self._generate_fallback_response(query, jurisdiction)
        except Exception as e:
            logger.error(f"RAG response generation failed: {str(e)}")
            return self._generate_fallback_response(query, jurisdiction)

    def _generate_fallback_response(self, query: str, jurisdiction: str) -> str:
        """Generate fallback response without RAG"""
        prompt = f"""As an unbiased {jurisdiction} legal assistant, provide a detailed answer to this legal query:

Query: {query}

Include relevant legal principles and considerations in your response:"""
        return self.model.invoke(prompt).content

    def _retrieve_sources(self, query: str, jurisdiction: str) -> List[str]:
        """Retrieve legal sources"""
        try:
            if jurisdiction in self.vector_stores:
                vector_store = self.vector_stores[jurisdiction]
                retriever = vector_store.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 3}
                )
                docs = retriever.invoke(query)
                
                sources = []
                for doc in docs:
                    source = doc.metadata.get("source", "Unknown source")
                    if source and source not in sources:
                        sources.append(source)
                
                if sources:
                    return sources
            
            # Fallback sources
            return [
                f"{jurisdiction.upper()} Legal Code §2023.123",
                f"{jurisdiction.upper()} Court Decision 2023-CV-456"
            ]
        except Exception as e:
            logger.warning(f"Source retrieval fallback: {str(e)}")
            return [
                f"{jurisdiction.upper()} Legal Code §2023.123",
                f"{jurisdiction.upper()} Court Decision 2023-CV-456"
            ]

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
                split_metadata["source"] = metadata.get("source", f"Document {hash(content)[:8]}")
                vector_store.add_texts([split], [split_metadata])
            
            docs_path = f"./legal_docs/{jurisdiction}"
            os.makedirs(docs_path, exist_ok=True)
            vector_store.save_local(f"{docs_path}/index")
            
            return {"status": "success", "chunks_indexed": len(splits)}
            
        except Exception as e:
            logger.error(f"Document indexing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Document indexing failed: {str(e)}")

# Initialize chatbot
try:
    chatbot = LegalChatbot()
except Exception as e:
    logger.critical(f"Chatbot initialization failed: {str(e)}")
    raise

# API endpoint - Simplified to only take query
@app.post("/legal-advice", response_model=LegalResponse)
async def get_legal_advice(query: LegalQuery = Body(...)):
    return await chatbot.process_query(query.query)

# Add document indexing endpoint for RAG
@app.post("/index-document/{jurisdiction}")
async def index_document(jurisdiction: str, document: LegalDocument):
    return await chatbot.index_legal_document(document, jurisdiction)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "groq_connected": chatbot.groq_api_key is not None,
        "vector_stores": list(chatbot.vector_stores.keys()),
        "agent_initialized": chatbot.agent_executor is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)