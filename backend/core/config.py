from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    upstage_api_key: str
    database_url: str = f"sqlite+aiosqlite:///{BASE_DIR}/receipts.db"
    upload_dir: str = str(BASE_DIR / "uploads")

    # Cloudinary (선택적 - 설정 시 클라우드 이미지 저장 사용)
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    model_config = {
        "env_file": str(BASE_DIR.parent / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    @property
    def use_cloudinary(self) -> bool:
        return bool(
            self.cloudinary_cloud_name
            and self.cloudinary_api_key
            and self.cloudinary_api_secret
        )


settings = Settings()
