from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    upstage_api_key: str
    database_url: str = f"sqlite+aiosqlite:///{BASE_DIR}/receipts.db"
    upload_dir: str = str(BASE_DIR / "uploads")

    model_config = {
        "env_file": str(BASE_DIR.parent / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
