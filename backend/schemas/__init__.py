from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ReceiptItemBase(BaseModel):
    item_name: str
    quantity: int = 1
    unit_price: float
    total_price: float


class ReceiptItemOut(ReceiptItemBase):
    id: int
    receipt_id: int

    model_config = {"from_attributes": True}


class ReceiptBase(BaseModel):
    store_name: str
    date: date
    total_amount: float
    category: Optional[str] = None


class ReceiptOut(ReceiptBase):
    id: int
    image_path: Optional[str] = None
    created_at: datetime
    items: list[ReceiptItemOut] = []

    model_config = {"from_attributes": True}


class ReceiptListItem(ReceiptBase):
    id: int
    image_path: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ReceiptUpdate(BaseModel):
    store_name: Optional[str] = None
    date: Optional[date] = None
    total_amount: Optional[float] = None
    category: Optional[str] = None
    items: Optional[list[ReceiptItemBase]] = None


class ReceiptListResponse(BaseModel):
    items: list[ReceiptListItem]
    total: int
    page: int
    per_page: int
    total_pages: int


class CategoryStat(BaseModel):
    category: str
    total: float


class MonthlyStat(BaseModel):
    month: str
    total: float


class DailyStat(BaseModel):
    date: str
    total: float


class StatsSummary(BaseModel):
    total_amount: float
    count: int
    by_category: list[CategoryStat]
    by_month: list[MonthlyStat]
    by_day: list[DailyStat]
