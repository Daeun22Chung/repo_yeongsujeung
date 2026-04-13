from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from contextlib import asynccontextmanager

from sqlalchemy import text
from core.config import settings
from database.session import init_db, AsyncSessionLocal
from api.routers import receipts, stats, categories


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    # Cloudinary 전역 설정
    if settings.use_cloudinary:
        import cloudinary
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
            secure=True,
        )

    yield


app = FastAPI(
    title="AI 영수증 지출 관리",
    description="영수증 이미지를 업로드하면 AI가 자동으로 지출 내역을 분석·저장합니다.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 로컬 개발 시에만 업로드 파일 정적 서빙 (Cloudinary 미사용 시)
if not settings.use_cloudinary:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

app.include_router(receipts.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(categories.router, prefix="/api")


@app.get("/health", tags=["System"])
async def health_check():
    try:
        async with AsyncSessionLocal() as db:
            await db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {e}"

    return {
        "status": "ok",
        "service": "AI 영수증 지출 관리 API",
        "database": db_status,
    }
