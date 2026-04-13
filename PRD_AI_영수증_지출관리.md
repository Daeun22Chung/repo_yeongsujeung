# PRD: AI 영수증 지출 관리 시스템
## Product Requirements Document
### Receipt Intelligence & Expense Tracker

| 항목 | 내용 |
|------|------|
| 문서 버전 | v1.0.0 |
| 작성일 | 2026-04-13 |
| 상태 | 검토 중 |
| 최종 수정일 | 2026-04-13 |
| 관련 문서 | 개요서_AI_영수증_지출관리.md |

---

## 1. 배경 및 목적

### 1.1 문제 정의

현재 사용자들은 지출 관리를 위해 다음과 같은 불편을 겪고 있다.

- 수기 가계부는 지속성이 낮고 입력 오류가 발생하기 쉽다.
- 기존 가계부 앱은 품목 하나하나를 직접 입력해야 해 피로감이 높다.
- 영수증을 사진으로 보관하더라도 나중에 직접 내용을 파악해야 한다.
- 소비 패턴을 파악하려면 별도로 데이터를 정리·집계해야 한다.

### 1.2 해결 방안

영수증 이미지 또는 PDF를 업로드하면 Upstage Vision LLM이 자동으로 내용을 인식하고, 지출 항목을 구조화하여 저장·시각화하는 웹 애플리케이션을 개발한다.

### 1.3 핵심 가치 제안

| 가치 | 설명 |
|------|------|
| 무입력 자동화 | 영수증 촬영 한 번으로 지출 기록 완료 |
| 정확성 | AI OCR 기반 항목 추출로 수기 오류 제거 |
| 인사이트 | 카테고리·기간별 차트로 소비 패턴 즉시 파악 |
| 영속성 | DB 저장으로 언제든 재조회 및 수정 가능 |

---

## 2. 목표 및 성공 지표

### 2.1 제품 목표 (Product Goals)

1. 영수증 업로드부터 지출 저장까지 **3번 이내 클릭**으로 완료
2. OCR 추출 정확도 **90% 이상** 달성 (날짜, 상호명, 합계 기준)
3. 업로드 후 분석 결과 반환까지 **10초 이내**
4. 월별·카테고리별 통계를 **메인 대시보드에서 즉시** 확인

### 2.2 측정 지표 (KPIs)

| 지표 | 목표값 | 측정 방법 |
|------|--------|-----------|
| OCR 필드 정확도 | ≥ 90% | 샘플 영수증 100장 수동 검증 |
| 분석 응답 시간 | ≤ 10초 | API 응답 타임 로깅 |
| 업로드 성공률 | ≥ 99% | 업로드 API 에러율 모니터링 |
| 수동 수정 비율 | ≤ 20% | OCR 후 사용자 편집 횟수 추적 |

---

## 3. 사용자 정의

### 3.1 주요 사용자

**1차 타깃: 개인 지출 관리자**
- 영수증을 보관하는 습관이 있으나 정리가 번거로운 직장인·학생
- 소비 패턴을 파악하고 싶지만 수기 입력이 귀찮은 사용자
- 기술 친화적이며 웹 브라우저 사용에 익숙한 20~40대

### 3.2 사용자 시나리오

**시나리오 A — 빠른 지출 기록**
> 직장인 A씨는 편의점에서 구매 후 영수증을 받았다. 앱에 접속해 영수증 사진을 업로드하면 AI가 자동으로 항목을 추출하고 저장한다. 별도 입력 없이 10초 만에 지출 기록 완료.

**시나리오 B — 월말 소비 점검**
> B씨는 이번 달 지출이 걱정된다. 대시보드의 카테고리 파이 차트와 월별 막대 차트를 보며 외식비가 예상보다 많다는 것을 발견하고, 지출 내역 목록에서 상세 내역을 확인한다.

**시나리오 C — OCR 오류 수정**
> C씨는 OCR 결과에서 금액이 잘못 인식된 것을 발견했다. 지출 상세 화면에서 해당 항목을 직접 수정하고 저장한다.

---

## 4. 기능 요구사항

### 4.1 영수증 업로드 및 OCR 분석

#### F-01: 파일 업로드
- **설명**: 사용자가 영수증 이미지 또는 PDF 파일을 업로드할 수 있다.
- **지원 형식**: JPG, PNG, PDF
- **최대 파일 크기**: 10MB
- **입력 방식**: 파일 선택 버튼, 드래그 앤 드롭 모두 지원
- **수락 기준**:
  - [ ] JPG/PNG/PDF 이외 형식 업로드 시 명확한 오류 메시지 표시
  - [ ] 10MB 초과 파일 업로드 시 오류 메시지 표시
  - [ ] 업로드 중 진행 상태바 표시
  - [ ] 업로드 전 파일 미리보기 표시

#### F-02: OCR 분석 실행
- **설명**: 업로드된 파일을 Upstage Vision LLM으로 분석하여 지출 정보를 추출한다.
- **추출 항목**: 날짜, 상호명, 개별 항목(품명/수량/단가), 합계 금액, 카테고리
- **수락 기준**:
  - [ ] 분석 중 로딩 인디케이터 표시
  - [ ] 분석 실패 시 사용자에게 재시도 옵션 제공
  - [ ] 추출 결과를 사용자가 확인하는 화면으로 자동 이동

**OCR 출력 JSON 구조**:
```json
{
  "date": "2025-04-10",
  "store_name": "이마트 강남점",
  "items": [
    { "name": "우유 1L", "quantity": 2, "price": 3200 },
    { "name": "식빵", "quantity": 1, "price": 2500 }
  ],
  "total": 8900,
  "category": "식료품"
}
```

---

### 4.2 지출 내역 저장 및 관리

#### F-03: 지출 자동 저장
- **설명**: OCR 분석 결과를 확인 후 DB에 저장한다.
- **수락 기준**:
  - [ ] 저장 성공 시 성공 피드백(토스트 알림) 표시
  - [ ] 저장 후 지출 내역 목록으로 이동

#### F-04: 지출 내역 조회
- **설명**: 저장된 지출 내역을 목록으로 조회한다.
- **필터 조건**: 날짜 범위, 카테고리, 상호명 검색
- **수락 기준**:
  - [ ] 기본 정렬: 날짜 최신순
  - [ ] 페이지당 20건, 페이지네이션 지원
  - [ ] 필터 적용 시 결과 즉시 갱신
  - [ ] 검색 결과 없을 경우 빈 상태 안내 문구 표시

#### F-05: 지출 상세 조회 및 수정
- **설명**: 개별 영수증의 상세 정보를 확인하고 수동으로 수정할 수 있다.
- **수락 기준**:
  - [ ] 원본 영수증 이미지와 추출 결과를 나란히 표시
  - [ ] 날짜, 상호명, 카테고리, 개별 항목(품명·수량·단가) 모두 편집 가능
  - [ ] 항목 추가/삭제 가능
  - [ ] 저장 시 합계 금액 자동 재계산
  - [ ] 수정 취소(Cancel) 가능

#### F-06: 지출 삭제
- **설명**: 저장된 영수증 및 관련 항목을 삭제한다.
- **수락 기준**:
  - [ ] 삭제 전 확인 다이얼로그 표시
  - [ ] 삭제 시 영수증 + 관련 항목 + 이미지 파일 모두 제거
  - [ ] 삭제 후 목록 화면으로 복귀

---

### 4.3 지출 통계 시각화

#### F-07: 메인 대시보드
- **설명**: 주요 지출 현황을 한눈에 보여주는 대시보드
- **표시 항목**:
  - 이번 달 총 지출 금액
  - 카테고리별 지출 파이 차트
  - 최근 5건 지출 목록
- **수락 기준**:
  - [ ] 앱 진입 시 기본 화면으로 표시
  - [ ] 데이터 없을 경우 빈 상태 안내 표시

#### F-08: 통계 분석 화면
- **설명**: 기간·카테고리별 상세 통계 차트
- **차트 종류**:

| 차트 | 라이브러리 | 표시 내용 |
|------|-----------|-----------|
| 월별 막대 차트 | Recharts BarChart | 월별 총 지출 합계 |
| 카테고리 파이 차트 | Recharts PieChart | 카테고리별 비율 |
| 일별 추이 선 그래프 | Recharts LineChart | 일별 지출 변화 |

- **수락 기준**:
  - [ ] 기간 선택기(시작일~종료일) 제공
  - [ ] 차트 데이터 포인트 hover 시 수치 툴팁 표시
  - [ ] 선택 기간 내 데이터 없을 경우 안내 메시지 표시

---

### 4.4 영수증 이미지 관리

#### F-09: 이미지 뷰어
- **설명**: 저장된 영수증 원본 이미지를 조회한다.
- **수락 기준**:
  - [ ] 목록에서 썸네일 이미지 표시
  - [ ] 이미지 클릭 시 원본 크기로 확대 표시 (모달 또는 뷰어)
  - [ ] 이미지 없는 경우 placeholder 아이콘 표시

---

## 5. 비기능 요구사항

### 5.1 성능

| 항목 | 요구사항 |
|------|----------|
| OCR 분석 응답 시간 | 95th percentile ≤ 10초 |
| 목록 조회 응답 시간 | ≤ 500ms |
| 파일 업로드 크기 | 최대 10MB |
| 동시 업로드 지원 | 단일 사용자 기준 1건 (MVP 범위) |

### 5.2 신뢰성

- 업로드 실패 시 사용자에게 명확한 오류 메시지 및 재시도 안내 제공
- OCR 분석 실패 시 수동 입력 fallback 경로 제공
- DB 저장 실패 시 트랜잭션 롤백 처리

### 5.3 사용성

- 모든 주요 기능을 모바일 브라우저(375px 이상)에서 사용 가능하도록 반응형 UI 구현
- 색각 이상 사용자를 위해 차트에 색상 외 패턴/레이블 병용
- 로딩 상태, 성공, 오류 상태를 시각적으로 명확히 구분

### 5.4 보안

- API 키(`UPSTAGE_API_KEY`)는 서버 환경변수로만 관리, 클라이언트에 노출 금지
- 업로드 파일은 서버 내부 경로에만 저장, 직접 URL 접근 차단
- 파일 확장자 및 MIME 타입 서버 측 검증 (클라이언트 검증만으로 불충분)

### 5.5 접근성

- 주요 인터랙티브 요소(버튼, 입력 필드)에 키보드 접근 가능
- 이미지 요소에 alt 텍스트 제공

---

## 6. 기술 스택 및 시스템 아키텍처

### 6.1 기술 스택

**백엔드**

| 기술 | 버전 | 역할 |
|------|------|------|
| Python | 3.13+ | 런타임 |
| FastAPI | 0.135.3 | REST API 서버 |
| LangChain | 1.2.15 | LLM 파이프라인 |
| LangChain Core | 1.2.28 | LangChain 핵심 라이브러리 |
| LangChain OpenAI | 1.1.12 | OpenAI 연동 |
| LangChain Upstage | 0.7.7 | Upstage Vision LLM OCR |
| LangSmith | 0.7.30 | LLM 파이프라인 추적·디버깅 |
| SQLAlchemy | 2.0.49 | ORM |
| SQLite | 내장 | 지출 데이터 저장 |

**프론트엔드**

| 기술 | 버전 | 역할 |
|------|------|------|
| ReactJS | 18+ | UI 컴포넌트 |
| Vite | 5+ | 빌드 도구 |
| TailwindCSS | 3+ | 스타일링 |
| Recharts | 2+ | 통계 차트 |
| Axios | 1.6+ | HTTP 클라이언트 |

### 6.2 시스템 아키텍처

```
[브라우저: React + Vite + TailwindCSS]
         │  HTTP (Axios)
         ▼
[FastAPI 서버]
  ├─ /api/receipts/upload  →  LangChain + Upstage Vision LLM
  ├─ /api/receipts/*       →  SQLite CRUD
  └─ /api/stats/*          →  SQLite 집계 쿼리
         │
         ▼
[SQLite DB]
  ├─ receipts (영수증)
  └─ receipt_items (항목)
```

### 6.3 데이터 모델

**receipts**

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INTEGER | PK, AUTOINCREMENT | 영수증 ID |
| store_name | TEXT | NOT NULL | 상호명 |
| date | DATE | NOT NULL | 구매 날짜 |
| total_amount | REAL | NOT NULL | 합계 금액 |
| category | TEXT | | 지출 카테고리 |
| image_path | TEXT | | 원본 이미지 경로 |
| raw_json | TEXT | | LLM 출력 원본 JSON |
| created_at | DATETIME | DEFAULT NOW | 레코드 생성 시각 |

**receipt_items**

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INTEGER | PK, AUTOINCREMENT | 항목 ID |
| receipt_id | INTEGER | FK → receipts.id | 영수증 참조 |
| item_name | TEXT | NOT NULL | 상품명 |
| quantity | INTEGER | DEFAULT 1 | 수량 |
| unit_price | REAL | NOT NULL | 단가 |
| total_price | REAL | NOT NULL | 소계 |

---

## 7. API 명세

| 엔드포인트 | Method | URL | 설명 |
|-----------|--------|-----|------|
| 영수증 업로드 | POST | `/api/receipts/upload` | 파일 업로드 + OCR 분석 + DB 저장 |
| 영수증 목록 조회 | GET | `/api/receipts` | 필터·페이지 파라미터 지원 |
| 영수증 상세 조회 | GET | `/api/receipts/{id}` | 항목 포함 상세 반환 |
| 영수증 수정 | PUT | `/api/receipts/{id}` | 영수증·항목 수동 수정 |
| 영수증 삭제 | DELETE | `/api/receipts/{id}` | 영수증·항목·이미지 삭제 |
| 지출 통계 조회 | GET | `/api/stats/summary` | 기간·카테고리별 집계 데이터 |
| 카테고리 목록 | GET | `/api/categories` | 사용 가능한 카테고리 목록 |

### 공통 응답 형식

**성공**
```json
{ "status": "success", "data": { ... } }
```

**오류**
```json
{ "status": "error", "code": "INVALID_FILE_TYPE", "message": "지원하지 않는 파일 형식입니다." }
```

---

## 8. 화면 구성 및 UI 흐름

### 8.1 화면 목록

| No. | 화면명 | 경로 | 주요 컴포넌트 |
|:---:|--------|------|--------------|
| 1 | 메인 대시보드 | `/` | 이번 달 요약, 파이 차트, 최근 지출 목록 |
| 2 | 영수증 업로드 | `/upload` | 드래그앤드롭 업로드, 미리보기, 분석 진행바 |
| 3 | 지출 내역 목록 | `/expenses` | 검색/필터바, 테이블, 페이지네이션 |
| 4 | 지출 상세/수정 | `/expenses/:id` | 이미지 뷰어, 항목 편집 폼 |
| 5 | 통계 분석 | `/stats` | 기간 선택기, BarChart, LineChart, PieChart |

### 8.2 화면 흐름

```
[메인 대시보드 /]
      │
      ├─ [업로드 버튼]
      │       │
      │       ▼
      │  [업로드 화면 /upload]
      │       │  파일 선택 / 드래그앤드롭
      │       ▼
      │  [AI 분석 중... 로딩]
      │       │  OCR 처리 완료
      │       ▼
      │  [상세/수정 화면 /expenses/:id]  ← 자동 이동
      │       │  확인 또는 수정 후 저장
      │       ▼
      │  [지출 내역 목록 /expenses]
      │
      └─ [통계 메뉴]
              │
              ▼
         [통계 분석 /stats]
```

---

## 9. 화면 디자인 및 스타일 가이드

### 9.1 디자인 원칙

| 원칙 | 설명 |
|------|------|
| 명료함 (Clarity) | 숫자·금액 정보가 주인공 — 불필요한 장식 요소 최소화 |
| 일관성 (Consistency) | 동일한 동작에는 동일한 UI 패턴 사용 (예: 삭제는 항상 빨간 버튼) |
| 피드백 (Feedback) | 모든 비동기 동작(업로드·분석·저장)에 시각적 상태 표시 |
| 반응형 (Responsive) | 모바일(375px) → 태블릿(768px) → 데스크탑(1280px) 순으로 설계 |

---

### 9.2 컬러 시스템

앱 전체는 **밝은 배경의 라이트 테마**를 기본으로 하며, TailwindCSS 유틸리티 클래스를 기준으로 정의한다.

#### 주요 색상 팔레트

| 역할 | 색상명 | Tailwind 클래스 | Hex | 사용처 |
|------|--------|----------------|-----|--------|
| Primary | Indigo 600 | `bg-indigo-600` | `#4F46E5` | 주요 버튼, 활성 메뉴, 링크 |
| Primary Hover | Indigo 700 | `hover:bg-indigo-700` | `#4338CA` | Primary 버튼 hover 상태 |
| Primary Light | Indigo 50 | `bg-indigo-50` | `#EEF2FF` | 선택된 행 배경, 강조 배지 |
| Success | Emerald 500 | `bg-emerald-500` | `#10B981` | 저장 성공 토스트, 완료 상태 |
| Warning | Amber 400 | `bg-amber-400` | `#FBBF24` | OCR 신뢰도 낮음 경고 |
| Danger | Rose 500 | `bg-rose-500` | `#F43F5E` | 삭제 버튼, 오류 메시지 |
| Neutral 배경 | Gray 50 | `bg-gray-50` | `#F9FAFB` | 페이지 전체 배경 |
| 카드 배경 | White | `bg-white` | `#FFFFFF` | 카드, 모달, 사이드바 |
| 테두리 | Gray 200 | `border-gray-200` | `#E5E7EB` | 카드·입력 필드 테두리 |
| 본문 텍스트 | Gray 900 | `text-gray-900` | `#111827` | 주요 텍스트 |
| 보조 텍스트 | Gray 500 | `text-gray-500` | `#6B7280` | 레이블, placeholder, 날짜 |

#### 카테고리별 차트 색상

차트에서 색상 외에 레이블을 병용하여 색각 이상 사용자를 배려한다.

| 카테고리 | Tailwind | Hex |
|----------|----------|-----|
| 식료품 | `#6366F1` | Indigo |
| 외식 | `#F59E0B` | Amber |
| 쇼핑 | `#10B981` | Emerald |
| 교통 | `#3B82F6` | Blue |
| 의료 | `#EF4444` | Red |
| 문화/여가 | `#8B5CF6` | Violet |
| 기타 | `#9CA3AF` | Gray |

---

### 9.3 타이포그래피

폰트는 시스템 기본 폰트 스택을 사용한다 (별도 웹폰트 로드 없이 TailwindCSS 기본값 유지).

```
font-family: ui-sans-serif, system-ui, -apple-system, sans-serif
```

| 용도 | 크기 | 굵기 | Tailwind 클래스 |
|------|------|------|----------------|
| 페이지 제목 | 24px | Bold (700) | `text-2xl font-bold text-gray-900` |
| 섹션 제목 | 18px | Semibold (600) | `text-lg font-semibold text-gray-900` |
| 카드 제목 | 16px | Medium (500) | `text-base font-medium text-gray-900` |
| 본문 | 14px | Regular (400) | `text-sm text-gray-700` |
| 보조 텍스트 | 12px | Regular (400) | `text-xs text-gray-500` |
| 금액 (강조) | 20px | Bold (700) | `text-xl font-bold text-gray-900` |
| 배지 텍스트 | 11px | Medium (500) | `text-[11px] font-medium` |

---

### 9.4 레이아웃 및 간격

#### 전체 레이아웃 구조

```
┌──────────────────────────────────────────────────┐
│                  Navbar (h-14)                   │
├──────────────┬───────────────────────────────────┤
│              │                                   │
│  Sidebar     │       Main Content Area           │
│  (w-56)      │       (max-w-5xl, mx-auto)        │
│              │       px-6 py-8                   │
│              │                                   │
└──────────────┴───────────────────────────────────┘
```

- 사이드바: 데스크탑에서 고정 표시, 모바일에서 오버레이 슬라이드 메뉴로 전환
- 콘텐츠 영역 최대 너비: `max-w-5xl` (1024px)
- 페이지 내부 padding: `px-6 py-8`

#### 반응형 브레이크포인트 (TailwindCSS 기본값)

| 이름 | 최소 너비 | 레이아웃 변화 |
|------|----------|--------------|
| `sm` | 640px | 그리드 2열 전환 |
| `md` | 768px | 사이드바 표시, 필터 행 전개 |
| `lg` | 1024px | 콘텐츠 영역 최대 너비 적용 |
| `xl` | 1280px | 대시보드 카드 4열 |

#### 공통 간격 기준

| 용도 | 값 | Tailwind |
|------|----|----------|
| 카드 내부 padding | 24px | `p-6` |
| 카드 간 간격 | 16px | `gap-4` |
| 섹션 간 간격 | 32px | `space-y-8` |
| 입력 필드 높이 | 40px | `h-10` |
| 버튼 높이 | 36px (기본), 40px (Primary) | `h-9` / `h-10` |

---

### 9.5 컴포넌트 스타일 가이드

#### 버튼

| 종류 | 용도 | Tailwind 클래스 |
|------|------|----------------|
| Primary | 주요 동작 (저장, 업로드 시작) | `bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium` |
| Secondary | 보조 동작 (취소, 목록으로) | `bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium` |
| Danger | 삭제 동작 | `bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-medium` |
| Ghost | 텍스트형 동작 (편집 링크 등) | `text-indigo-600 hover:text-indigo-800 font-medium` |
| Disabled | 비활성 상태 | `opacity-50 cursor-not-allowed` 추가 |

#### 카드

```
bg-white rounded-2xl shadow-sm border border-gray-200 p-6
```

- 호버 효과 (목록 카드): `hover:shadow-md transition-shadow duration-150`
- 선택 상태: `ring-2 ring-indigo-500`

#### 입력 필드 (Input / Select)

```
w-full h-10 px-3 rounded-lg border border-gray-300
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
text-sm text-gray-900 placeholder-gray-400
```

- 오류 상태: `border-rose-500 focus:ring-rose-500`

#### 배지 (카테고리 태그)

```
inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
```

카테고리별 색상 조합 예시:

| 카테고리 | 배지 클래스 |
|----------|------------|
| 식료품 | `bg-indigo-100 text-indigo-700` |
| 외식 | `bg-amber-100 text-amber-700` |
| 쇼핑 | `bg-emerald-100 text-emerald-700` |
| 교통 | `bg-blue-100 text-blue-700` |
| 기타 | `bg-gray-100 text-gray-600` |

#### 드롭존 (파일 업로드 영역)

- 기본 상태: `border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50`
- 드래그 오버: `border-indigo-400 bg-indigo-50` (JS로 클래스 전환)
- 파일 선택 완료: `border-emerald-400 bg-emerald-50`

---

### 9.6 상태별 UI 처리

#### 로딩 상태

- **스켈레톤 로딩**: 목록·카드 영역에 회색 pulse 애니메이션 적용
  ```
  animate-pulse bg-gray-200 rounded
  ```
- **OCR 분석 진행바**: 단계별 텍스트와 함께 `progress` 바 표시
  - 1단계: 파일 업로드 중...
  - 2단계: AI 분석 중...
  - 3단계: 저장 중...
- **버튼 로딩**: Primary 버튼 내 스피너 아이콘 + 텍스트 변경 (`저장 중...`)

#### 성공 상태 — 토스트 알림

```
fixed bottom-6 right-6 z-50
bg-white border border-emerald-200 rounded-xl shadow-lg px-4 py-3
flex items-center gap-3 text-sm text-gray-800
```

- 자동 소멸: 3초 후 fade-out
- 아이콘: 초록 체크 아이콘 + 성공 메시지

#### 오류 상태

- **인라인 오류** (입력 필드 하단): `text-xs text-rose-500 mt-1`
- **전체 화면 오류**: 중앙 정렬 오류 일러스트 + 재시도 버튼
- **토스트 오류**: 배경 `bg-rose-50`, 테두리 `border-rose-200`

#### 빈 상태 (Empty State)

중앙 정렬, 아이콘(회색) + 안내 문구 + 액션 버튼 구성:

```
flex flex-col items-center justify-center py-16 text-center
```

| 화면 | 안내 문구 | 액션 버튼 |
|------|-----------|-----------|
| 지출 내역 목록 | "아직 등록된 지출이 없습니다." | 영수증 업로드하기 |
| 통계 화면 | "선택한 기간에 데이터가 없습니다." | 기간 변경 |
| 검색 결과 | "검색 결과가 없습니다." | 필터 초기화 |

---

### 9.7 화면별 와이어프레임 설명

#### 메인 대시보드 (`/`)

```
┌─────────────────────────────────────────────┐
│  이번 달 지출         ₩ 382,400             │  ← 요약 카드 (전체 너비)
├──────────────┬──────────────────────────────┤
│              │                              │
│  카테고리    │  월별 지출 막대 차트          │  ← 2열 그리드 (md 이상)
│  파이 차트   │                              │
│              │                              │
├──────────────┴──────────────────────────────┤
│  최근 지출 내역 (5건 테이블)                │
│  [더보기 →]                                │
└─────────────────────────────────────────────┘
```

#### 영수증 업로드 (`/upload`)

```
┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │   📄  파일을 드래그하거나             │  │  ← 드롭존 (점선 테두리)
│  │       클릭하여 선택하세요             │  │
│  │   JPG · PNG · PDF  /  최대 10MB      │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [미리보기 썸네일]   파일명.jpg  2.3MB  ✕  │  ← 파일 선택 후 표시
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━  분석 중... (60%)   │  ← OCR 진행바
│                                             │
│              [분석 시작]                    │  ← Primary 버튼
└─────────────────────────────────────────────┘
```

#### 지출 상세/수정 (`/expenses/:id`)

```
┌──────────────────┬──────────────────────────┐
│                  │  이마트 강남점            │
│  영수증 이미지   │  2025-04-10  [식료품 배지]│
│  뷰어            ├──────────────────────────┤
│  (클릭 시 확대)  │  품명        수량   금액  │
│                  │  우유 1L      2    3,200  │
│                  │  식빵         1    2,500  │
│                  │  [+ 항목 추가]            │
│                  ├──────────────────────────┤
│                  │  합계           ₩ 8,900  │
│                  ├──────────────────────────┤
│                  │  [취소]        [저장]     │
└──────────────────┴──────────────────────────┘
```

---

### 9.8 아이콘 및 시각 요소

- **아이콘 라이브러리**: `lucide-react` (Heroicons 대안, React 친화적)
- **아이콘 크기**: 인라인 `w-4 h-4`, 강조 `w-5 h-5`, 빈 상태 `w-12 h-12 text-gray-300`
- **영수증 이미지 썸네일 비율**: `aspect-[3/4]` (영수증 세로 비율 반영)
- **로딩 스피너**: `animate-spin` 적용한 원형 SVG 아이콘

---

## 10. 배포 구성

### 10.1 브랜치 전략

| 브랜치 | 역할 |
|--------|------|
| `main` | 운영 배포 — Vercel 자동 배포 트리거 |
| `develop` | 개발 통합 — 기능 브랜치 병합 후 테스트 |
| `feature/*` | 기능 단위 개발 (예: `feature/receipt-upload`) |
| `hotfix/*` | 운영 긴급 수정 |

### 10.2 환경변수

| 변수명 | 설명 | 관리 위치 |
|--------|------|-----------|
| `UPSTAGE_API_KEY` | Upstage Vision LLM API 키 | Vercel Dashboard / 로컬 `.env` |
| `DATABASE_URL` | SQLite 파일 경로 | 서버 환경변수 |
| `UPLOAD_DIR` | 이미지 저장 디렉토리 | 서버 환경변수 |

### 10.3 배포 파이프라인

```
개발자 로컬 → git push → GitHub (main)
                              │  Webhook
                              ▼
                        Vercel CI/CD
                         npm run build
                              │
                              ▼
                      Vercel CDN (글로벌)
```

---

## 11. 개발 범위 및 일정 (Milestones)

### 11.1 개발 우선순위

모든 기능은 **P0 → P1 → P2** 순으로 개발한다. P0는 서비스 핵심 동작에 필수적인 기능, P1은 사용성 완성도에 필요한 기능, P2는 가치를 높이지만 없어도 서비스 운영 가능한 기능이다.

| 우선순위 | 기준 | 개발 시기 |
|:--------:|------|-----------|
| **P0** — Must Have | 없으면 서비스 자체가 동작하지 않음 | 1~3주차 |
| **P1** — Should Have | 없으면 사용성이 크게 떨어짐 | 3~4주차 |
| **P2** — Nice to Have | 있으면 좋지만 없어도 MVP 완성 | 4~5주차 / v2.0 |

#### P0 — 핵심 기능 (Must Have)

| # | 기능 | 관련 화면 | 이유 |
|---|------|-----------|------|
| P0-1 | 영수증 이미지/PDF 업로드 | `/upload` | 서비스 진입점, 없으면 데이터 입력 불가 |
| P0-2 | Upstage Vision LLM OCR 분석 | `/upload` | 핵심 AI 기능, 없으면 자동화 가치 없음 |
| P0-3 | OCR 결과 DB 저장 | 내부 로직 | 데이터 영속성 확보 |
| P0-4 | 지출 내역 목록 조회 | `/expenses` | 저장된 데이터를 볼 수 없으면 무의미 |
| P0-5 | 지출 상세 조회 및 수동 수정 | `/expenses/:id` | OCR 오류 보정 경로 필수 |
| P0-6 | 지출 삭제 | `/expenses/:id` | 잘못된 데이터 제거 경로 필수 |

#### P1 — 사용성 기능 (Should Have)

| # | 기능 | 관련 화면 | 이유 |
|---|------|-----------|------|
| P1-1 | 메인 대시보드 (이번 달 요약, 최근 지출) | `/` | 앱 진입 시 즉시 현황 파악 가능 |
| P1-2 | 카테고리별 파이 차트 | `/` | 소비 패턴 시각화 — 핵심 가치 중 하나 |
| P1-3 | 지출 목록 필터 (날짜·카테고리·검색) | `/expenses` | 데이터 증가 시 탐색 필수 |
| P1-4 | 페이지네이션 | `/expenses` | 대량 데이터 처리 |
| P1-5 | 업로드 드래그앤드롭 + 파일 미리보기 | `/upload` | UX 완성도 |
| P1-6 | 로딩·성공·오류 상태 피드백 (토스트, 스켈레톤) | 전체 | 비동기 처리 신뢰감 확보 |
| P1-7 | 영수증 이미지 썸네일 및 확대 뷰어 | `/expenses/:id` | 원본 확인 없으면 수정 근거 부족 |
| P1-8 | 반응형 레이아웃 (모바일 대응) | 전체 | 모바일 업로드 시나리오 지원 |

#### P2 — 부가 기능 (Nice to Have)

| # | 기능 | 관련 화면 | 이유 |
|---|------|-----------|------|
| P2-1 | 월별 지출 막대 차트 | `/stats` | 추세 파악에 유용하나 파이만으로도 기본 충족 |
| P2-2 | 일별 지출 추이 선 그래프 | `/stats` | 세부 분석용, P1 이후 추가 |
| P2-3 | 기간 선택기 (통계 필터) | `/stats` | 통계 유연성 향상 |
| P2-4 | 빈 상태 안내 화면 (Empty State) | 전체 | UX 세련도, 기능에는 영향 없음 |
| P2-5 | 다중 사용자 / JWT 인증 | - | v2.0 목표 |
| P2-6 | 월별 예산 설정 및 초과 알림 | - | v2.0 목표 |
| P2-7 | Excel/CSV 내보내기 | - | v2.0 목표 |
| P2-8 | LLM 기반 월별 소비 리포트 | - | v2.0 목표 |
| P2-9 | PostgreSQL 마이그레이션 | - | 사용자 수 증가 시 |
| P2-10 | 모바일 앱 (PWA / React Native) | - | 장기 로드맵 |

---

### 11.2 마일스톤 개요

```
Week 1          Week 2          Week 3          Week 4          Week 5
  │               │               │               │               │
[환경·설계]  [백엔드 P0]   [프론트 P0]   [P1 완성·연동]  [QA·배포]
  │               │               │               │               │
  ▼               ▼               ▼               ▼               ▼
DB 스키마      OCR API        업로드 UI       대시보드        통합 테스트
API 명세       CRUD API       목록/상세       통계 차트       Vercel 배포
프로젝트 셋업   Upstage 연동   반응형 레이아웃  오류 처리       문서화
```

---

### 11.3 주차별 세부 태스크

#### Week 1 — 환경 설정 및 설계 (`M1: Project Foundation`)

**목표**: 개발 시작을 위한 모든 기반 완료

| 일차 | 영역 | 세부 태스크 |
|:----:|------|------------|
| Day 1 | 공통 | Git 저장소 생성, 브랜치 전략 적용 (`main` / `develop`), `.gitignore` 설정 |
| Day 1 | 공통 | 프로젝트 루트 디렉토리 구조 생성 (`backend/`, `frontend/`) |
| Day 2 | 백엔드 | Python 가상환경 구성, `requirements.txt` 작성 (FastAPI, LangChain, SQLAlchemy 등) |
| Day 2 | 백엔드 | FastAPI 앱 뼈대 생성 (`main.py`, CORS 설정, health check 엔드포인트) |
| Day 3 | 백엔드 | SQLite DB 스키마 설계 확정, SQLAlchemy ORM 모델 작성 (`receipts`, `receipt_items`) |
| Day 3 | 백엔드 | DB 초기화 스크립트 및 테이블 자동 생성 로직 구현 |
| Day 4 | 프론트엔드 | Vite + React 프로젝트 초기화, TailwindCSS 설정 |
| Day 4 | 프론트엔드 | React Router 설치 및 기본 라우팅 구조 (`/`, `/upload`, `/expenses`, `/stats`) |
| Day 5 | 공통 | Axios `client.js` 작성 (baseURL, 공통 에러 인터셉터) |
| Day 5 | 공통 | Navbar / Sidebar 레이아웃 컴포넌트 마크업 완성 |

**완료 기준**: `http://localhost:8000/health` 200 OK, React 앱 로컬 구동 확인

---

#### Week 2 — 백엔드 P0 개발 (`M2: Core API`)

**목표**: OCR 분석 및 지출 CRUD API 완성

| 일차 | 영역 | 세부 태스크 |
|:----:|------|------------|
| Day 1 | 백엔드 | Upstage API 키 환경변수 설정 (`config.py`, `.env`) |
| Day 1 | 백엔드 | `ocr_service.py` 구현 — LangChain + Upstage Vision LLM 호출 |
| Day 2 | 백엔드 | OCR 출력 JSON 파싱 및 정규화 로직 구현 (날짜 형식 통일, 금액 타입 변환) |
| Day 2 | 백엔드 | `POST /api/receipts/upload` 엔드포인트 구현 (파일 저장 → OCR → DB 저장) |
| Day 3 | 백엔드 | `GET /api/receipts` 구현 (날짜·카테고리 필터, 페이지네이션) |
| Day 3 | 백엔드 | `GET /api/receipts/{id}` 구현 (영수증 + 항목 join 조회) |
| Day 4 | 백엔드 | `PUT /api/receipts/{id}` 구현 (영수증·항목 수정, 합계 재계산) |
| Day 4 | 백엔드 | `DELETE /api/receipts/{id}` 구현 (영수증·항목·이미지 파일 삭제) |
| Day 5 | 백엔드 | `GET /api/stats/summary` 구현 (월별·카테고리별 집계 쿼리) |
| Day 5 | 백엔드 | `GET /api/categories` 구현, FastAPI Swagger 문서 검토 및 응답 스키마 정비 |

**완료 기준**: Swagger(`/docs`)에서 전체 엔드포인트 수동 테스트 통과, 샘플 영수증 3장 OCR 분석 성공

---

#### Week 3 — 프론트엔드 P0 개발 (`M3: Core UI`)

**목표**: 업로드·목록·상세 화면 기능 동작

| 일차 | 영역 | 세부 태스크 |
|:----:|------|------------|
| Day 1 | 프론트엔드 | `DropZone.jsx` 구현 (드래그앤드롭, 파일 유형·크기 검증) |
| Day 1 | 프론트엔드 | `FilePreview.jsx` 구현 (썸네일, 파일명·크기 표시, 제거 버튼) |
| Day 2 | 프론트엔드 | `AnalysisProgress.jsx` 구현 (3단계 진행바: 업로드→분석→저장) |
| Day 2 | 프론트엔드 | `Upload.jsx` 페이지 조립, 업로드 API 연동, 분석 완료 후 `/expenses/:id` 자동 이동 |
| Day 3 | 프론트엔드 | `ExpenseTable.jsx` 구현 (컬럼: 날짜·상호명·카테고리·금액·액션) |
| Day 3 | 프론트엔드 | `Pagination.jsx` 구현, `ExpenseList.jsx` 페이지 조립 및 목록 API 연동 |
| Day 4 | 프론트엔드 | `ReceiptImageViewer.jsx` 구현 (썸네일 + 클릭 시 모달 확대) |
| Day 4 | 프론트엔드 | `ExpenseForm.jsx` 구현 (항목 편집, 추가·삭제, 합계 자동 계산) |
| Day 5 | 프론트엔드 | `ExpenseDetail.jsx` 페이지 조립, 상세·수정·삭제 API 연동 |
| Day 5 | 프론트엔드 | `useReceipts.js` 커스텀 훅 분리, 공통 `Toast.jsx` / `Modal.jsx` 컴포넌트 완성 |

**완료 기준**: 영수증 업로드 → OCR → 수정 → 삭제 전체 플로우 브라우저에서 동작 확인

---

#### Week 4 — P1 완성 및 백-프론트 통합 (`M4: Feature Complete`)

**목표**: 대시보드·통계·필터·반응형 UI 완성, 전체 연동

| 일차 | 영역 | 세부 태스크 |
|:----:|------|------------|
| Day 1 | 프론트엔드 | `CategoryPieChart.jsx` 구현 (Recharts PieChart, 카테고리 색상 적용, 레이블 표시) |
| Day 1 | 프론트엔드 | `Dashboard.jsx` — 이번 달 총 지출 카드 + 파이 차트 + 최근 5건 목록 조립 |
| Day 2 | 프론트엔드 | `MonthlyBarChart.jsx` 구현 (Recharts BarChart, hover 툴팁) |
| Day 2 | 프론트엔드 | `DailyLineChart.jsx` 구현 (Recharts LineChart) |
| Day 2 | 프론트엔드 | `Stats.jsx` 페이지 — 기간 선택기 + 3개 차트 조립, 통계 API 연동 |
| Day 3 | 프론트엔드 | `ExpenseFilter.jsx` 구현 (날짜 범위 선택, 카테고리 셀렉트, 상호명 검색) |
| Day 3 | 프론트엔드 | `EmptyState.jsx` 구현, 빈 상태 분기 처리 (목록·통계·검색 결과) |
| Day 4 | 프론트엔드 | 스켈레톤 로딩 적용 (목록, 카드, 차트 영역) |
| Day 4 | 프론트엔드 | 반응형 레이아웃 점검 — 모바일(375px), 태블릿(768px), 데스크탑(1280px) |
| Day 5 | 공통 | 백-프론트 연동 전체 흐름 검증, CORS·API 경로 오류 수정 |
| Day 5 | 공통 | 오류 경계(Error Boundary) 적용, 네트워크 오류 처리 UX 개선 |

**완료 기준**: 모든 화면이 실제 API 데이터로 정상 렌더링, 모바일 Chrome에서 주요 기능 동작 확인

---

#### Week 5 — QA, 버그 수정 및 배포 (`M5: Production Launch`)

**목표**: 안정성 검증 후 Vercel 배포

| 일차 | 영역 | 세부 태스크 |
|:----:|------|------------|
| Day 1 | QA | 엔드-투-엔드 시나리오 테스트 (업로드→분석→저장→수정→삭제→통계 확인) |
| Day 1 | QA | 경계 케이스 테스트: 10MB 초과 파일, 비지원 형식, 빈 영수증 이미지 |
| Day 2 | QA | OCR 정확도 검증 — 샘플 영수증 20장 분석, 오인식 패턴 파악 |
| Day 2 | 백엔드 | 프롬프트 튜닝 (OCR 정확도 미달 항목 개선) |
| Day 3 | 공통 | 발견된 버그 수정, 성능 병목 확인 (목록 조회 응답 시간 ≤ 500ms 검증) |
| Day 3 | 배포 | Vercel 프로젝트 생성, GitHub 연동, 환경변수 (`UPSTAGE_API_KEY` 등) 설정 |
| Day 4 | 배포 | 프론트엔드 `npm run build` 확인, Vercel Preview URL 동작 검증 |
| Day 4 | 배포 | 백엔드 배포 환경(Railway / Fly.io) 설정, 프론트엔드 API baseURL 운영 환경으로 전환 |
| Day 5 | 공통 | `main` 브랜치 머지, Vercel 운영 배포 최종 확인 |
| Day 5 | 공통 | README.md 작성 (로컬 실행 방법, 환경변수 목록, 스크린샷) |

**완료 기준**: 운영 URL에서 영수증 업로드~통계 조회 전체 플로우 정상 동작

---

### 11.4 릴리즈 계획

| 버전 | 시기 | 포함 범위 |
|------|------|-----------|
| **v1.0.0 (MVP)** | 5주차 말 | P0 + P1 전체, P2 중 Empty State |
| **v1.1.0** | MVP 후 2주 | 사용자 피드백 반영, OCR 정확도 개선, 버그 수정 |
| **v2.0.0** | MVP 후 2개월 | JWT 인증, 예산 알림, Excel 내보내기, PostgreSQL 전환 |

---

## 12. 프로젝트 구조 (Project Structure)

### 12.1 전체 디렉토리 구조

```
receipt-expense-tracker/
├── backend/                        # FastAPI 백엔드
│   ├── app/
│   │   ├── main.py                 # FastAPI 앱 진입점, CORS 설정
│   │   ├── database.py             # SQLite 연결 및 세션 관리
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── receipt.py          # SQLAlchemy ORM 모델 (receipts)
│   │   │   └── receipt_item.py     # SQLAlchemy ORM 모델 (receipt_items)
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── receipt.py          # Pydantic 요청/응답 스키마
│   │   │   └── stats.py            # 통계 응답 스키마
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── receipts.py         # /api/receipts/* 라우터
│   │   │   ├── stats.py            # /api/stats/* 라우터
│   │   │   └── categories.py       # /api/categories 라우터
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ocr_service.py      # LangChain + Upstage Vision LLM 연동
│   │   │   └── stats_service.py    # 통계 집계 비즈니스 로직
│   │   └── core/
│   │       ├── __init__.py
│   │       └── config.py           # 환경변수 로드 (pydantic-settings)
│   ├── uploads/                    # 업로드된 영수증 이미지 저장소
│   ├── receipt.db                  # SQLite DB 파일
│   ├── requirements.txt
│   └── .env                        # UPSTAGE_API_KEY 등 환경변수 (git 제외)
│
├── frontend/                       # React + Vite 프론트엔드
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── main.jsx                # React 앱 진입점
│   │   ├── App.jsx                 # 라우터 설정 (React Router)
│   │   ├── api/
│   │   │   └── client.js           # Axios 인스턴스 및 공통 API 함수
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # 메인 대시보드 (/)
│   │   │   ├── Upload.jsx          # 영수증 업로드 (/upload)
│   │   │   ├── ExpenseList.jsx     # 지출 내역 목록 (/expenses)
│   │   │   ├── ExpenseDetail.jsx   # 지출 상세/수정 (/expenses/:id)
│   │   │   └── Stats.jsx           # 통계 분석 (/stats)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx      # 상단 네비게이션 바
│   │   │   │   └── Sidebar.jsx     # 사이드 메뉴
│   │   │   ├── upload/
│   │   │   │   ├── DropZone.jsx    # 드래그앤드롭 업로드 영역
│   │   │   │   ├── FilePreview.jsx # 업로드 전 파일 미리보기
│   │   │   │   └── AnalysisProgress.jsx  # OCR 분석 진행바
│   │   │   ├── expense/
│   │   │   │   ├── ExpenseTable.jsx      # 지출 목록 테이블
│   │   │   │   ├── ExpenseFilter.jsx     # 검색/필터 바
│   │   │   │   ├── ExpenseForm.jsx       # 지출 항목 편집 폼
│   │   │   │   └── ReceiptImageViewer.jsx # 영수증 이미지 뷰어
│   │   │   ├── charts/
│   │   │   │   ├── MonthlyBarChart.jsx   # 월별 지출 막대 차트
│   │   │   │   ├── CategoryPieChart.jsx  # 카테고리 파이 차트
│   │   │   │   └── DailyLineChart.jsx    # 일별 추이 선 그래프
│   │   │   └── common/
│   │   │       ├── Pagination.jsx        # 페이지네이션
│   │   │       ├── Toast.jsx             # 토스트 알림
│   │   │       ├── Modal.jsx             # 공통 모달
│   │   │       └── EmptyState.jsx        # 빈 상태 안내
│   │   └── hooks/
│   │       ├── useReceipts.js      # 영수증 CRUD 커스텀 훅
│   │       └── useStats.js         # 통계 데이터 커스텀 훅
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

### 12.2 백엔드 핵심 모듈 설명

| 모듈 | 경로 | 역할 |
|------|------|------|
| `main.py` | `backend/app/` | FastAPI 앱 생성, CORS 미들웨어, 라우터 등록 |
| `ocr_service.py` | `backend/app/services/` | Upstage Vision LLM 호출, JSON 파싱, 카테고리 추론 |
| `receipts.py` (router) | `backend/app/routers/` | 업로드·조회·수정·삭제 엔드포인트 구현 |
| `config.py` | `backend/app/core/` | `UPSTAGE_API_KEY`, `DATABASE_URL` 등 환경변수 관리 |
| `database.py` | `backend/app/` | SQLAlchemy 엔진·세션 팩토리, 테이블 자동 생성 |

### 12.3 프론트엔드 핵심 모듈 설명

| 모듈 | 경로 | 역할 |
|------|------|------|
| `App.jsx` | `frontend/src/` | React Router 경로 정의 (`/`, `/upload`, `/expenses`, `/stats`) |
| `client.js` | `frontend/src/api/` | Axios baseURL 설정, 공통 에러 인터셉터 |
| `DropZone.jsx` | `frontend/src/components/upload/` | 파일 선택·드래그앤드롭, MIME 타입·크기 검증 |
| `ExpenseForm.jsx` | `frontend/src/components/expense/` | OCR 결과 표시 및 항목 수동 편집 |
| `useReceipts.js` | `frontend/src/hooks/` | 영수증 목록·상세 fetch, 낙관적 업데이트 처리 |

---

## 13. 미결 사항 (Open Questions)

| # | 질문 | 담당 | 기한 |
|---|------|------|------|
| 1 | OCR 정확도가 90% 미만일 경우 사용자에게 어느 수준까지 경고를 줄 것인가? | PO | - |
| 2 | 카테고리 목록을 고정값으로 관리할 것인가, 사용자 커스텀을 허용할 것인가? | PO | - |
| 3 | 이미지 파일을 서버 로컬에 저장할 것인가, 외부 스토리지(S3 등)를 사용할 것인가? | 개발 | - |
| 4 | FastAPI 백엔드도 Vercel에 배포할 것인가, 별도 서버(Railway, Fly.io 등)를 사용할 것인가? | 개발 | - |

---

*PRD: AI 영수증 지출 관리 시스템 v1.0.0*
