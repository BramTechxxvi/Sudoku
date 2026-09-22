from fastapi import FastAPI
from app.routes.sudoku_router import router as routes
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import ALLOWED_ORIGINS


app = FastAPI(
    title="Sudoku API",
    version= "1.0.0"
)

app.add.middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(routes)

@app.get("/health")
def health_check():
    return { 
            "status": "healthy" 
            }