import os


FRONTEND_URL = os.getenv(
    # "FRONTEND_URL",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:8000"
)

ALLOWED_ORIGINS = [
    FRONTEND_URL
]