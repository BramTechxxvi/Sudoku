import os


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5500"
)

ALLOWED_ORIGINS = [
    FRONTEND_URL
]