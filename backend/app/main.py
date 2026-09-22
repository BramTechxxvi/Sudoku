from fastapi import FastAPI
from app.routes.sudoku_router import router as routes

app = FastAPI()
app.include_router(routes)

@app.get("/health")
def health_check():
    return { 
            "status": "healthy" 
            }