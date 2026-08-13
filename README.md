# at PRIVÉ — Private Healthcare & Longevity V1

완전히 새로 제작한 at PRIVÉ 브랜드 홈페이지다. 기존 atinc GitHub 저장소는 수정하지 않는다.

## 핵심 구조
- 메인: 8개 시네마틱 챕터, 데스크톱 scroll-snap
- PROGRAMS: `data/programs.json` 기반 동적 목록
- PROGRAM DETAIL: 쿼리스트링 기반 공통 상세 템플릿
- GLOBAL ACCESS: 외부 라이브러리 없는 Canvas 기반 인터랙티브 네트워크
- FOUNDER: 새 프로필 구조, 사진 영역은 비워둠
- CHATBOT: 향후 연결용 UI shell
- 가격: 공개하지 않음

## 폰트
윤고딕 우선 CSS 스택만 사용한다. 폰트 파일은 포함하지 않는다.
접속 기기에 윤고딕이 없으면 Noto Sans KR / Apple SD Gothic Neo로 대체된다.

## 로컬 실행
```bash
python3 -m http.server 8765
```
브라우저: http://localhost:8765

## 새 GitHub 저장소
기본 저장소명: `at-prive-private-healthcare`
`DEPLOY_NEW_GITHUB.command` 실행 시 새 저장소를 생성하거나 해당 저장소만 업데이트한다.
