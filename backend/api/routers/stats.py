from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from services import stats_service

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/summary")
async def get_summary(
    start_date: str = Query(default=None),
    end_date: str = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()
    if not start_date:
        start_date = today.replace(day=1).isoformat()
    if not end_date:
        end_date = today.isoformat()

    data = await stats_service.get_summary(db, start_date, end_date)
    return {"status": "success", "data": data}
