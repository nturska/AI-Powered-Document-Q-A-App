import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from core.dependencies import embeddings, vector_store_state

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        pages = PyPDFLoader(tmp_path).load()
    finally:
        os.unlink(tmp_path)

    chunks = RecursiveCharacterTextSplitter(
        chunk_size=500, chunk_overlap=50
    ).split_documents(pages)

    vector_store_state.store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
    )

    return {"message": "PDF uploaded successfully", "pages": len(pages), "chunks": len(chunks)}