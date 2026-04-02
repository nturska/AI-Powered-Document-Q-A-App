# AI-Powered-Document-Q-A-App
This is a web app where users upload PDFs or paste URLs, and an AI answers questions about the content using Retrieval-Augmented Generation (RAG).

Frontend: React + TypeScript — file upload UI, chat interface with streaming responses

Backend: Python (FastAPI) — LangChain RAG pipeline with document chunking and embeddings

GCP: Cloud Run for the Python API, Vertex AI (Gemini) as the LLM, Cloud Storage for uploaded files
