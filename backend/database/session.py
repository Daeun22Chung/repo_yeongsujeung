from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool
from core.config import settings
from database.models import Base

# 서버리스(Vercel)에서는 PostgreSQL 연결 풀링 문제 방지를 위해 NullPool 사용
_is_postgres = settings.database_url.startswith("postgresql")

engine = create_async_engine(
    settings.database_url,
    echo=False,
    poolclass=NullPool if _is_postgres else None,
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
