import json
from pathlib import Path
from langchain_upstage import ChatUpstage
from langchain_core.messages import HumanMessage
from core.config import settings


async def analyze_receipt(image_path: str) -> dict:
    """Upstage Vision LLM으로 영수증 이미지 분석."""
    llm = ChatUpstage(
        api_key=settings.upstage_api_key,
        model="solar-pro",
    )

    prompt = """이 영수증 이미지를 분석해서 다음 JSON 형식으로만 응답하세요.
JSON 외의 텍스트는 절대 포함하지 마세요.

{
  "date": "YYYY-MM-DD",
  "store_name": "상호명",
  "items": [
    {"name": "품명", "quantity": 수량, "price": 단가}
  ],
  "total": 합계금액,
  "category": "카테고리(식료품/외식/교통/의류/의료/문화/교육/생활용품/기타 중 하나)"
}

날짜를 알 수 없으면 오늘 날짜를 사용하세요."""

    file_path = Path(image_path)
    suffix = file_path.suffix.lower()
    mime = "application/pdf" if suffix == ".pdf" else "image/jpeg" if suffix in (".jpg", ".jpeg") else "image/png"

    with open(image_path, "rb") as f:
        image_data = f.read()

    import base64
    b64 = base64.b64encode(image_data).decode()

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
        ]
    )

    response = await llm.ainvoke([message])
    raw = response.content.strip()

    # JSON 파싱
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)
