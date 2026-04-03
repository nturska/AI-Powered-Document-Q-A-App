import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    streaming=True,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)
class VectorStoreState:
    store: Chroma | None = None

vector_store_state = VectorStoreState()