#!/usr/bin/env python3
"""
Claude Code Stop Hook: PRD 자동 업데이트
1. 구현 완료된 기능 → PRD 체크리스트 자동 체크
2. 변경된 API 명세 → PRD API 테이블 동기화
3. 작업 완료 시 → PRD 날짜/상태 업데이트
"""

import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent
PRD_FILE = PROJECT_DIR / "PRD_AI_영수증_지출관리.md"


# ─────────────────────────────────────────────────────────────
# 1. 변경된 파일 목록 수집
# ─────────────────────────────────────────────────────────────

def get_changed_files() -> set[str]:
    """git으로 변경된 파일 목록 반환 (unstaged + staged + untracked)"""
    try:
        cmds = [
            ["git", "diff", "--name-only"],
            ["git", "diff", "--name-only", "--cached"],
            ["git", "ls-files", "--others", "--exclude-standard"],
        ]
        all_files: set[str] = set()
        for cmd in cmds:
            r = subprocess.run(cmd, cwd=PROJECT_DIR, capture_output=True, text=True)
            all_files.update(f for f in r.stdout.strip().split("\n") if f)
        return all_files
    except Exception:
        return set()


# ─────────────────────────────────────────────────────────────
# 2. 파일 패턴 → PRD 수락 기준 매핑
# ─────────────────────────────────────────────────────────────

FILE_CRITERIA_MAP: list[tuple[str, list[str]]] = [
    (
        r"frontend/.*[Uu]pload|frontend/.*[Dd]rop[Zz]one",
        [
            "JPG/PNG/PDF 이외 형식 업로드 시 명확한 오류 메시지 표시",
            "10MB 초과 파일 업로드 시 오류 메시지 표시",
            "업로드 중 진행 상태바 표시",
            "업로드 전 파일 미리보기 표시",
        ],
    ),
    (
        r"backend/.*receipt|backend/.*ocr",
        [
            "분석 중 로딩 인디케이터 표시",
            "분석 실패 시 사용자에게 재시도 옵션 제공",
            "추출 결과를 사용자가 확인하는 화면으로 자동 이동",
            "저장 성공 시 성공 피드백(토스트 알림) 표시",
            "저장 후 지출 내역 목록으로 이동",
        ],
    ),
    (
        r"frontend/.*[Ee]xpense[Ll]ist|frontend/.*[Ff]ilter[Bb]ar",
        [
            "기본 정렬: 날짜 최신순",
            "페이지당 20건, 페이지네이션 지원",
            "필터 적용 시 결과 즉시 갱신",
            "검색 결과 없을 경우 빈 상태 안내 문구 표시",
        ],
    ),
    (
        r"frontend/.*[Ee]xpense[Dd]etail|frontend/.*[Ee]xpense[Ff]orm",
        [
            "원본 영수증 이미지와 추출 결과를 나란히 표시",
            "날짜, 상호명, 카테고리, 개별 항목(품명·수량·단가) 모두 편집 가능",
            "항목 추가/삭제 가능",
            "저장 시 합계 금액 자동 재계산",
            "수정 취소(Cancel) 가능",
        ],
    ),
    (
        r"frontend/.*[Dd]elete|backend/.*delete",
        [
            "삭제 전 확인 다이얼로그 표시",
            "삭제 시 영수증 + 관련 항목 + 이미지 파일 모두 제거",
            "삭제 후 목록 화면으로 복귀",
        ],
    ),
    (
        r"frontend/.*[Dd]ashboard",
        [
            "앱 진입 시 기본 화면으로 표시",
            "데이터 없을 경우 빈 상태 안내 표시",
        ],
    ),
    (
        r"frontend/.*[Ss]tats|frontend/.*[Cc]hart",
        [
            "기간 선택기(시작일~종료일) 제공",
            "차트 데이터 포인트 hover 시 수치 툴팁 표시",
            "선택 기간 내 데이터 없을 경우 안내 메시지 표시",
        ],
    ),
    (
        r"frontend/.*[Ii]mage[Vv]iewer",
        [
            "목록에서 썸네일 이미지 표시",
            "이미지 클릭 시 원본 크기로 확대 표시 (모달 또는 뷰어)",
            "이미지 없는 경우 placeholder 아이콘 표시",
        ],
    ),
]


def check_criteria(content: str, changed_files: set[str]) -> tuple[str, int]:
    """변경된 파일에 해당하는 체크박스를 [ ] → [x] 로 업데이트. 변경 수 반환."""
    count = 0
    for pattern, criteria_list in FILE_CRITERIA_MAP:
        matched = any(re.search(pattern, f) for f in changed_files)
        if not matched:
            continue
        for criterion in criteria_list:
            old = f"[ ] {criterion}"
            new = f"[x] {criterion}"
            if old in content:
                content = content.replace(old, new)
                count += 1
    return content, count


# ─────────────────────────────────────────────────────────────
# 3. API 명세 동기화
# ─────────────────────────────────────────────────────────────

def sync_api_table(content: str) -> tuple[str, bool]:
    """백엔드 라우터 파일에서 엔드포인트를 읽어 PRD API 테이블에 없는 항목 추가."""
    router_dir = PROJECT_DIR / "backend" / "api" / "routers"
    if not router_dir.exists():
        return content, False

    # 라우터 파일에서 HTTP 메서드 + 경로 파싱
    found_routes: list[tuple[str, str]] = []
    for py_file in sorted(router_dir.glob("*.py")):
        text = py_file.read_text(encoding="utf-8", errors="ignore")
        for match in re.finditer(
            r'@router\.(get|post|put|delete|patch)\s*\(\s*["\']([^"\']+)["\']',
            text,
        ):
            method = match.group(1).upper()
            path = match.group(2)
            found_routes.append((method, path))

    if not found_routes:
        return content, False

    # PRD ## 7. API 명세 섹션 찾기
    section_match = re.search(
        r"(## 7\. API 명세.*?)(?=\n## |\Z)", content, re.DOTALL
    )
    if not section_match:
        return content, False

    section_text = section_match.group(1)
    new_rows: list[str] = []

    for method, path in found_routes:
        # 이미 테이블에 있으면 스킵
        if path in section_text:
            continue
        new_rows.append(f"| (자동 감지) | {method} | `{path}` | 라우터에서 자동 감지 |")

    if not new_rows:
        return content, False

    # 테이블의 마지막 행 뒤에 삽입
    table_row_end = [(m.end()) for m in re.finditer(r"\| .+ \|\n", section_text)]
    if not table_row_end:
        return content, False

    last_row_end_in_section = table_row_end[-1]
    insert_pos = section_match.start() + last_row_end_in_section
    insertion = "\n".join(new_rows) + "\n"
    content = content[:insert_pos] + insertion + content[insert_pos:]
    return content, True


# ─────────────────────────────────────────────────────────────
# 4. 날짜 / 상태 업데이트
# ─────────────────────────────────────────────────────────────

def update_metadata(content: str) -> str:
    """PRD 헤더 테이블의 최종 수정일과 상태를 업데이트."""
    today = datetime.now().strftime("%Y-%m-%d")

    # 최종 수정일 행 업데이트 또는 추가
    if "최종 수정일" in content:
        content = re.sub(
            r"(\| 최종 수정일 \| ).+?( \|)",
            rf"\g<1>{today}\2",
            content,
        )
    else:
        # | 상태 | ... | 행 바로 뒤에 삽입
        content = re.sub(
            r"(\| 상태 \| [^\n]+\|)",
            rf"\1\n| 최종 수정일 | {today} |",
            content,
        )

    # 체크 완료 비율로 상태 자동 계산
    total = content.count("- [ ]") + content.count("- [x]")
    done = content.count("- [x]")
    if total > 0:
        ratio = done / total
        if ratio >= 1.0:
            status = "완료"
        elif ratio >= 0.5:
            status = "개발 중"
        elif ratio > 0:
            status = "구현 중"
        else:
            status = "검토 중"
        content = re.sub(
            r"(\| 상태 \| ).+?( \|)",
            rf"\g<1>{status}\2",
            content,
        )

    return content


# ─────────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────────

def main() -> None:
    # Stop hook 이벤트 데이터 읽기 (사용하지 않아도 stdin은 소비해야 함)
    try:
        json.loads(sys.stdin.read())
    except Exception:
        pass

    if not PRD_FILE.exists():
        sys.exit(0)

    original = PRD_FILE.read_text(encoding="utf-8")
    content = original
    changed_files = get_changed_files()

    # 1. 체크리스트 자동 체크
    if changed_files:
        content, checked = check_criteria(content, changed_files)

    # 2. API 명세 동기화
    content, _ = sync_api_table(content)

    # 3. 날짜 / 상태 업데이트
    content = update_metadata(content)

    # 변경이 있을 때만 파일 저장
    if content != original:
        PRD_FILE.write_text(content, encoding="utf-8")

    sys.exit(0)


if __name__ == "__main__":
    main()
