"""
시드 데이터 스크립트
실행: python seed.py
"""
import asyncio
from datetime import date, timedelta
import random
from database.session import init_db, AsyncSessionLocal
from database.models import Receipt, ReceiptItem

SEED_DATA = [
    {
        "store_name": "이마트 강남점",
        "date_offset": -1,
        "total_amount": 38500,
        "category": "식료품",
        "items": [
            ("우유 1L", 2, 3200),
            ("식빵", 1, 2500),
            ("계란 30구", 1, 8900),
            ("닭가슴살 200g", 3, 4500),
            ("당근", 1, 1800),
        ],
    },
    {
        "store_name": "스타벅스 역삼점",
        "date_offset": -2,
        "total_amount": 14500,
        "category": "외식",
        "items": [
            ("아메리카노 Tall", 2, 5000),
            ("카페라떼 Grande", 1, 5500),
            ("크루아상", 1, 4000),
        ],
    },
    {
        "store_name": "GS25 테헤란점",
        "date_offset": -3,
        "total_amount": 7800,
        "category": "식료품",
        "items": [
            ("삼각김밥 참치마요", 2, 1500),
            ("컵라면 신라면", 1, 1400),
            ("이온음료 게토레이", 1, 1700),
            ("과자 포카칩", 1, 1700),
        ],
    },
    {
        "store_name": "롯데마트 잠실점",
        "date_offset": -5,
        "total_amount": 62000,
        "category": "생활용품",
        "items": [
            ("세제 피죤 3L", 1, 12000),
            ("화장지 30롤", 1, 18000),
            ("주방세제 퐁퐁", 2, 4500),
            ("칫솔 3개입", 1, 5500),
            ("샴푸 팬틴 680ml", 1, 14500),
            ("린스 팬틴 680ml", 1, 7500),
        ],
    },
    {
        "store_name": "CGV 강남",
        "date_offset": -7,
        "total_amount": 26000,
        "category": "문화",
        "items": [
            ("영화관람권 성인", 2, 13000),
        ],
    },
    {
        "store_name": "버거킹 서초점",
        "date_offset": -8,
        "total_amount": 18500,
        "category": "외식",
        "items": [
            ("와퍼 세트", 1, 9500),
            ("불고기버거 세트", 1, 8500),
            ("음료 업사이즈", 1, 500),
        ],
    },
    {
        "store_name": "교보문고 강남점",
        "date_offset": -10,
        "total_amount": 32000,
        "category": "교육",
        "items": [
            ("파이썬 딥러닝 입문", 1, 22000),
            ("독서 노트", 1, 10000),
        ],
    },
    {
        "store_name": "올리브영 삼성점",
        "date_offset": -12,
        "total_amount": 45000,
        "category": "의료",
        "items": [
            ("선크림 SPF50+", 1, 18000),
            ("마스크팩 10매", 1, 15000),
            ("비타민C 세럼", 1, 12000),
        ],
    },
    {
        "store_name": "이마트 강남점",
        "date_offset": -15,
        "total_amount": 55200,
        "category": "식료품",
        "items": [
            ("삼겹살 500g", 2, 12000),
            ("된장찌개용 두부", 2, 1800),
            ("양파 1kg", 1, 3500),
            ("마늘 500g", 1, 4900),
            ("고추장 500g", 1, 6800),
            ("참기름 340ml", 1, 7900),
            ("간장 900ml", 1, 4500),
        ],
    },
    {
        "store_name": "지하철 교통카드",
        "date_offset": -16,
        "total_amount": 50000,
        "category": "교통",
        "items": [
            ("교통카드 충전", 1, 50000),
        ],
    },
    {
        "store_name": "맥도날드 강남점",
        "date_offset": -20,
        "total_amount": 16500,
        "category": "외식",
        "items": [
            ("빅맥 세트", 1, 9500),
            ("맥너겟 6조각", 1, 4500),
            ("아이스크림", 1, 1000),
            ("음료 추가", 1, 1500),
        ],
    },
    {
        "store_name": "홈플러스 양재점",
        "date_offset": -22,
        "total_amount": 41000,
        "category": "식료품",
        "items": [
            ("소고기 국거리용 300g", 1, 15000),
            ("시금치 한 단", 1, 3500),
            ("무 1개", 1, 2500),
            ("대파 한 단", 1, 2000),
            ("냉동만두 540g", 1, 7900),
            ("즉석밥 10개", 1, 10100),
        ],
    },
    # 지난달 데이터
    {
        "store_name": "스타벅스 강남점",
        "date_offset": -35,
        "total_amount": 12000,
        "category": "외식",
        "items": [
            ("아이스 아메리카노 Venti", 2, 6000),
        ],
    },
    {
        "store_name": "GS25 역삼점",
        "date_offset": -38,
        "total_amount": 5400,
        "category": "식료품",
        "items": [
            ("도시락 불고기", 1, 3900),
            ("이온음료", 1, 1500),
        ],
    },
    {
        "store_name": "쿠팡로켓배송",
        "date_offset": -40,
        "total_amount": 89000,
        "category": "생활용품",
        "items": [
            ("커피캡슐 50개입", 1, 35000),
            ("에어팟 케이스", 1, 15000),
            ("USB 허브 4포트", 1, 22000),
            ("마우스 패드 XXL", 1, 17000),
        ],
    },
]


async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        # 기존 데이터 확인
        from sqlalchemy import select, func
        count = (await db.execute(select(func.count()).select_from(Receipt))).scalar_one()
        if count > 0:
            print(f"이미 {count}건의 데이터가 있습니다. 시드를 건너뜁니다.")
            print("초기화 후 다시 실행하려면 receipts.db를 삭제하고 실행하세요.")
            return

        today = date.today()
        for d in SEED_DATA:
            receipt_date = today + timedelta(days=d["date_offset"])
            items = d["items"]
            total = sum(qty * price for _, qty, price in items)

            receipt = Receipt(
                store_name=d["store_name"],
                date=receipt_date,
                total_amount=total,
                category=d["category"],
            )
            db.add(receipt)
            await db.flush()

            for name, qty, price in items:
                db.add(ReceiptItem(
                    receipt_id=receipt.id,
                    item_name=name,
                    quantity=qty,
                    unit_price=price,
                    total_price=qty * price,
                ))

        await db.commit()
        print(f"시드 데이터 {len(SEED_DATA)}건 추가 완료!")


if __name__ == "__main__":
    asyncio.run(seed())
