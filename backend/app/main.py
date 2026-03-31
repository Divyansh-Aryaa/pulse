# main.py
from fastapi import FastAPI
from app.services.init_db import init_db
from app.routers.project_routes import router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

init_db()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:8000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

@app.get("/")
def home():
    return {"message": "API is running"}

app.include_router(router)