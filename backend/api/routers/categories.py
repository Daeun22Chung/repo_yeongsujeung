from fastapi import APIRouter

router = APIRouter(prefix="/categories", tags=["Categories"])

CATEGORIES = ["식료품", "외식", "교통", "의류", "의료", "문화", "교육", "생활용품", "기타"]


@router.get("")
async def get_categories():
    return {"status": "success", "data": CATEGORIES}
