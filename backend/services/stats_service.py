from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Receipt


async def get_summary(db: AsyncSession, start_date: str, end_date: str) -> dict:
    base_q = select(Receipt).where(
        Receipt.date >= start_date,
        Receipt.date <= end_date,
    )

    rows = (await db.execute(base_q)).scalars().all()

    total_amount = sum(r.total_amount for r in rows)
    count = len(rows)

    # 카테고리별
    cat_map: dict[str, float] = {}
    for r in rows:
        key = r.category or "기타"
        cat_map[key] = cat_map.get(key, 0) + r.total_amount
    by_category = [{"category": k, "total": v} for k, v in sorted(cat_map.items(), key=lambda x: -x[1])]

    # 월별
    month_map: dict[str, float] = {}
    for r in rows:
        key = r.date.strftime("%Y-%m")
        month_map[key] = month_map.get(key, 0) + r.total_amount
    by_month = [{"month": k, "total": v} for k, v in sorted(month_map.items())]

    # 일별
    day_map: dict[str, float] = {}
    for r in rows:
        key = r.date.strftime("%Y-%m-%d")
        day_map[key] = day_map.get(key, 0) + r.total_amount
    by_day = [{"date": k, "total": v} for k, v in sorted(day_map.items())]

    return {
        "total_amount": total_amount,
        "count": count,
        "by_category": by_category,
        "by_month": by_month,
        "by_day": by_day,
    }
