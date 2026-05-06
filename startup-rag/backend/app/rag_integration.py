"""
RAG Integration Module
Connects the Data Ingestion RAG pipeline to the FastAPI backend
"""

import os
import sys
import logging
from typing import List, Dict, Tuple, Optional

logger = logging.getLogger(__name__)

# Add Data Ingestion path for imports
# Path: backend/app/rag_integration.py -> ../../Data Ingestion
current_file = os.path.abspath(__file__)
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_file)))  # go up to backend/
project_root = os.path.dirname(backend_dir)  # go up to ai-verse/
data_ingestion_path = os.path.join(project_root, "Data Ingestion")

if os.path.exists(data_ingestion_path):
    sys.path.insert(0, data_ingestion_path)
    logger.info(f"✅ Added Data Ingestion path: {data_ingestion_path}")
else:
    logger.warning(f"⚠️ Data Ingestion path not found: {data_ingestion_path}")

class RAGRetriever:
    """
    RAG Retrieval System for Funding Advice
    Uses vector store from Data Ingestion folder
    """
    
    def __init__(self):
        self.retriever = None
        self.is_available = False
        self._initialize_rag()
    
    def _initialize_rag(self):
        """Initialize RAG retriever if available - deferred lazy initialization"""
        # Don't initialize during module import - will be done on first use
        pass
    
    def _lazy_init_retriever(self):
        """Lazy initialization of RAG components on first use"""
        if self.is_available or self.retriever is not None:
            return  # Already initialized or failed
        
        try:
            # Import and initialize RAG components
            from vector_store.retriever import Retriever  # type: ignore
            self.retriever = Retriever()
            self.is_available = True
            logger.info("✅ RAG Retriever initialized successfully")
        except ImportError as e:
            logger.warning(f"RAG not available - Data Ingestion modules not found: {e}")
            logger.info("📋 System will run without RAG - answers will be based on Gemini's knowledge only")
            self.is_available = False
        except (ValueError, AttributeError) as e:
            # Compatibility issues (NumPy version mismatch, Keras 3 incompatibility, etc.)
            logger.warning(f"RAG initialization failed due to compatibility issue: {str(e)}")
            logger.info("📋 System will run without RAG - answers will be based on Gemini's knowledge only")
            self.is_available = False
        except Exception as e:
            logger.error(f"Failed to initialize RAG: {type(e).__name__}: {str(e)}")
            logger.info("📋 System will run without RAG - answers will be based on Gemini's knowledge only")
            self.is_available = False
    
    def retrieve_context(self, query: str, top_k: int = 3) -> Tuple[List[str], List[Dict]]:
        """
        Retrieve relevant context chunks for a query
        
        Args:
            query: User question
            top_k: Number of documents to retrieve
            
        Returns:
            Tuple of (documents, metadata)
        """
        # Lazy initialize on first use
        if not self.is_available and self.retriever is None:
            self._lazy_init_retriever()
        
        if not self.is_available or not self.retriever:
            logger.warning("RAG retriever not available, returning empty context")
            return [], []
        
        try:
            logger.info(f"🔍 Retrieving top {top_k} chunks for query: {query[:100]}...")
            docs, metas = self.retriever.search(query, top_k=top_k)
            
            if docs and len(docs) > 0:
                logger.info(f"✅ Retrieved {len(docs)} relevant documents")
                # Log first chunk preview
                if docs[0]:
                    logger.debug(f"First chunk preview: {docs[0][:200]}...")
            else:
                logger.warning("⚠️ No documents retrieved from RAG")
            
            return docs, metas
            
        except Exception as e:
            logger.error(f"RAG retrieval error: {type(e).__name__}: {str(e)}")
            return [], []
    
    def format_rag_context(self, docs: List[str], metas: List[Dict]) -> str:
        """
        Format retrieved documents into a context string for LLM
        
        Args:
            docs: List of retrieved document chunks
            metas: List of metadata for each document
            
        Returns:
            Formatted context string
        """
        if not docs:
            return ""
        
        context_parts = []
        for i, (doc, meta) in enumerate(zip(docs, metas), 1):
            source = meta.get('source_file', 'unknown')
            context_parts.append(f"[Document {i} from {source}]\n{doc}\n")
        
        return "\n".join(context_parts)


# Global RAG instance
rag_retriever = RAGRetriever()
