import os


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)

ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:5173",
    http://127.0.0.1:5173
]