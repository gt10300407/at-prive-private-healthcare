# at PRIVÉ 홈페이지 운영 가이드

## 브랜드 계층
- 고객 전면 브랜드: **at PRIVÉ**
- 고객 경험 정의: **Private Healthcare & Longevity / Global Medical Concierge**
- 법인 표기: **주식회사 애트 | Brand: at PRIVÉ**
- `PLATFORM`은 회사 구조 설명에 사용하고 HERO 전면에는 사용하지 않는다.

## 공개 전 반드시 확인
- CHA/차병원 또는 개별 병원명을 홈페이지에서 공개할 수 있는 계약·표현 권한
- 외국인환자 유치사업자 등록 및 관련 표시 범위
- 파트너 병원의 외국인환자 유치 등록 여부
- 재생의학·세포 기반 프로그램의 실제 시행 범위
- 대표 학위·자격의 정확한 명칭과 발급기관
- 통역·차량·숙박 등 파트너 수행 업무의 계약 관계

## 프로그램 확장
`data/programs.json`에 항목을 추가하면 PROGRAMS 목록과 상세 페이지를 추가 HTML 없이 확장할 수 있다.
병원별 페이지를 만들지 않고, 고객 목적 중심 프로그램에 병원/전문의 연결정보를 내부 데이터로 연결하는 구조를 권장한다.

## 향후 권장 데이터 구조
- `data/programs.json`: 고객 공개 프로그램
- `data/partners.json`: 병원·바이오·웰니스 파트너 (공개 여부 포함)
- `data/regions.json`: 실제 글로벌 연결 지역
- `data/content.json`: 향후 Journal/Insight

## 챗봇
현재 UI shell만 포함. 향후 RAG/상담 봇 연결 시 의료 진단·치료 추천을 하지 않고 서비스 안내 및 상담 접수 범위로 제한한다.
