from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from core.dependencies import llm, vector_store_state

router = APIRouter(prefix="/ask", tags=["ask"])

prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant. Use ONLY the provided context to answer the question.
If the answer isn't in the context, say "I couldn't find that in the document."

Context:
{context}

Question: {question}

Answer:""")

@router.get("")
async def ask(q: str):
    if vector_store_state.store is None:
        raise HTTPException(status_code=400, detail="No PDF uploaded yet.")

    retriever = vector_store_state.store.as_retriever(search_kwargs={"k": 4})
    chain = prompt | llm | StrOutputParser()

    async def stream_response():
        docs = retriever.invoke(q)
        context = "\n\n".join(doc.page_content for doc in docs)
        async for token in chain.astream({"context": context, "question": q}):
            yield f"data: {token}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
async def stream_response():
    try:
        docs = retriever.invoke(q)
        context = "\n\n".join(doc.page_content for doc in docs)
        async for token in chain.astream({"context": context, "question": q}):
            yield f"data: {token}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            yield "data: ⚠️ Rate limit reached. Please wait 30 seconds and try again.\n\n"
        else:
            yield f"data: ⚠️ Something went wrong: {error_str[:120]}\n\n"
        yield "data: [DONE]\n\n"