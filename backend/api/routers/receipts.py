import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from database.session import get_db
from schemas import ReceiptOut, ReceiptListResponse, ReceiptUpdate
from services import ocr_service, receipt_service

router = APIRouter(prefix="/receipts", tags=["Receipts"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, detail="지원하지 않는 파일 형식입니다. JPG, PNG, PDF만 가능합니다.")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(400, detail="파일 크기가 10MB를 초과합니다.")

    # 파일 저장
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = upload_dir / filename

    with open(save_path, "wb") as f:
        f.write(content)

    try:
        ocr_data = await ocr_service.analyze_receipt(str(save_path))
    except Exception as e:
        save_path.unlink(missing_ok=True)
        raise HTTPException(500, detail=f"OCR 분석 실패: {str(e)}")

    receipt = await receipt_service.create_receipt_from_ocr(db, ocr_data, str(save_path))
    return {"status": "success", "data": ReceiptOut.model_validate(receipt)}


@router.get("", response_model=dict)
async def list_receipts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    date_from: str | None = None,
    date_to: str | None = None,
    category: str | None = None,
    store_name: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    items, total, total_pages = await receipt_service.list_receipts(
        db, page, per_page, date_from, date_to, category, store_name
    )
    return {
        "status": "success",
        "data": ReceiptListResponse(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
        ),
    }


@router.get("/{receipt_id}")
async def get_receipt(receipt_id: int, db: AsyncSession = Depends(get_db)):
    receipt = await receipt_service.get_receipt(db, receipt_id)
    if not receipt:
        raise HTTPException(404, detail="영수증을 찾을 수 없습니다.")
    return {"status": "success", "data": ReceiptOut.model_validate(receipt)}


@router.put("/{receipt_id}")
async def update_receipt(
    receipt_id: int,
    data: ReceiptUpdate,
    db: AsyncSession = Depends(get_db),
):
    receipt = await receipt_service.update_receipt(db, receipt_id, data)
    if not receipt:
        raise HTTPException(404, detail="영수증을 찾을 수 없습니다.")
    return {"status": "success", "data": ReceiptOut.model_validate(receipt)}


@router.delete("/{receipt_id}")
async def delete_receipt(receipt_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await receipt_service.delete_receipt(db, receipt_id)
    if not deleted:
        raise HTTPException(404, detail="영수증을 찾을 수 없습니다.")
    return {"status": "success", "data": {"id": receipt_id}}
