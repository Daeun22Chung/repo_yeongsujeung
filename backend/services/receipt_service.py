import asyncio
import json
import math
import re
from datetime import date
from pathlib import Path

from sqlalchemy import select, func, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from database.models import Receipt, ReceiptItem
from schemas import ReceiptUpdate


def _extract_cloudinary_public_id(url: str) -> str | None:
    """Cloudinary URL에서 public_id 추출."""
    match = re.search(r'/upload/(?:v\d+/)?(.+?)(?:\.\w+)?$', url)
    return match.group(1) if match else None


async def create_receipt_from_ocr(db: AsyncSession, ocr_data: dict, image_path: str | None) -> Receipt:
    receipt_date = ocr_data.get("date")
    if isinstance(receipt_date, str):
        from datetime import datetime
        try:
            receipt_date = datetime.strptime(receipt_date, "%Y-%m-%d").date()
        except ValueError:
            receipt_date = date.today()
    else:
        receipt_date = date.today()

    # 품목 소계 합산
    items_data = ocr_data.get("items", [])
    items_sum = sum(
        int(it.get("quantity", 1)) * float(it.get("price", 0))
        for it in items_data
    )
    ocr_total = float(ocr_data.get("total", 0))
    if items_sum > 0 and ocr_total > 0:
        ratio = abs(items_sum - ocr_total) / max(items_sum, ocr_total)
        total_amount = ocr_total if ratio < 0.2 else items_sum
    else:
        total_amount = ocr_total or items_sum

    receipt = Receipt(
        store_name=ocr_data.get("store_name", "알 수 없음"),
        date=receipt_date,
        total_amount=total_amount,
        category=ocr_data.get("category"),
        image_path=image_path,
        raw_json=json.dumps(ocr_data, ensure_ascii=False),
    )
    db.add(receipt)
    await db.flush()

    for item in items_data:
        qty = int(item.get("quantity", 1))
        price = float(item.get("price", 0))
        db.add(ReceiptItem(
            receipt_id=receipt.id,
            item_name=item.get("name", ""),
            quantity=qty,
            unit_price=price,
            total_price=qty * price,
        ))

    await db.commit()
    return await get_receipt(db, receipt.id)


async def list_receipts(
    db: AsyncSession,
    page: int = 1,
    per_page: int = 20,
    date_from: str | None = None,
    date_to: str | None = None,
    category: str | None = None,
    store_name: str | None = None,
):
    q = select(Receipt).order_by(Receipt.date.desc(), Receipt.created_at.desc())

    if date_from:
        q = q.where(Receipt.date >= date_from)
    if date_to:
        q = q.where(Receipt.date <= date_to)
    if category:
        q = q.where(Receipt.category == category)
    if store_name:
        q = q.where(Receipt.store_name.contains(store_name))

    count_q = select(func.count()).select_from(q.subquery())
    total = (await db.execute(count_q)).scalar_one()

    offset = (page - 1) * per_page
    rows = (await db.execute(q.offset(offset).limit(per_page))).scalars().all()

    return rows, total, math.ceil(total / per_page) if per_page else 1


async def get_receipt(db: AsyncSession, receipt_id: int) -> Receipt | None:
    result = await db.execute(
        select(Receipt)
        .options(selectinload(Receipt.items))
        .where(Receipt.id == receipt_id)
    )
    return result.scalar_one_or_none()


async def update_receipt(db: AsyncSession, receipt_id: int, data: ReceiptUpdate) -> Receipt | None:
    receipt = await get_receipt(db, receipt_id)
    if not receipt:
        return None

    if data.store_name is not None:
        receipt.store_name = data.store_name
    if data.date is not None:
        receipt.date = data.date
    if data.total_amount is not None:
        receipt.total_amount = data.total_amount
    if data.category is not None:
        receipt.category = data.category

    if data.items is not None:
        await db.execute(delete(ReceiptItem).where(ReceiptItem.receipt_id == receipt_id))
        for it in data.items:
            db.add(ReceiptItem(
                receipt_id=receipt_id,
                item_name=it.item_name,
                quantity=it.quantity,
                unit_price=it.unit_price,
                total_price=it.total_price,
            ))

    await db.commit()
    return await get_receipt(db, receipt_id)


async def delete_receipt(db: AsyncSession, receipt_id: int) -> bool:
    receipt = await get_receipt(db, receipt_id)
    if not receipt:
        return False

    if receipt.image_path:
        if receipt.image_path.startswith("http"):
            # Cloudinary 이미지 삭제
            if settings.use_cloudinary:
                public_id = _extract_cloudinary_public_id(receipt.image_path)
                if public_id:
                    try:
                        import cloudinary.uploader
                        await asyncio.to_thread(
                            cloudinary.uploader.destroy, public_id, resource_type="image"
                        )
                    except Exception:
                        pass  # 이미지 삭제 실패해도 DB 레코드는 삭제
        else:
            # 로컬 파일 삭제
            p = Path(settings.upload_dir) / Path(receipt.image_path).name
            p.unlink(missing_ok=True)

    await db.delete(receipt)
    await db.commit()
    return True
