from fastapi import APIRouter
from core.dependencies import vector_store_state

router = APIRouter(prefix="/health", tags=["health"])

@router.get("")
async def health():
    return {"status": "ok", "pdf_loaded": vector_store_state.store is not None}