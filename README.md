# at PRIVÉ Private Healthcare V2

V1 시각 검수 피드백을 반영한 재설계본.

## 주요 수정
- 브랜드 로고 타이포그래피 재설계
- 전반적인 본문/카드/CTA 글자 크기 상향
- Hero orbit 및 카드 크기 확대, 애니메이션 강화
- 저렴하게 느껴지는 감성 문구 제거, 서비스 중심 카피로 교체
- 고정형 실제 세계지도 + 순차 라인 애니메이션
- Journey File 카피와 줄바꿈 전면 수정
- Founder 상세 내용을 메인 페이지에 통합, 별도 페이지 링크 제거
- 의료 접근 목록은 한국어 메인 + 영어 보조 구조
- 모든 클릭 요소에 명확한 CTA와 hover 표시
- Programs 및 Program Detail CTA/타이포그래피 전면 개선
- 데스크톱 scroll snap 유지 / 모바일 proximity 완화

기존 `atinc-*` 저장소는 수정하지 않는다.


## V3 Luxury refinement
- Korean/body typography: Noto Sans KR first, English/logo: Bodoni Moda first
- Solid block CTAs replaced by hairline luxury CTAs
- Signature Journey/Medical Access copy updated
- Fixed particle globe restored; no rotation; sequential hub/route illumination only
- Programs filter rebuilt with visible counts and active category heading
- Program detail CTA rebuilt with restrained hairline treatment


## V4 refinement
- 주요 대형 제목 줄바꿈 고정
- 실제 대륙 형태를 가진 고정형 럭셔리 지구본 적용
- Korea 중심 순차 연결선 + 최종 글로벌 확장 웨이브
- Concierge 런처를 58px 소형 원형으로 축소, hover 시 pill 확장


## V5 수정
- 지구본 위치 마커를 위경도 투영이 아닌 실제 globe artwork 좌표에 고정해 한국/일본/아시아 포인트 오차 수정
- 서비스/상담 섹션 대형 카피를 의도한 3줄 구성으로 분리해 PC 화면 잘림 방지
- 1~3번 피드백 외 나머지 구조와 애니메이션은 V4 유지


## V6 — Map & Founder refinement
- GLOBAL PRIVATE ACCESS: CHINA added, all visible routes anchored to actual land positions, slower sequence, restrained final horizon bloom.
- Founder section: redesigned as luxury brochure/profile layout based on provided reference; portrait remains intentionally blank for later replacement.
- Only map and founder sections materially changed from V5.


## V7 Private Access Atlas
- radial/starburst routes removed
- fixed Korea-centered regional access chain
- no projectile particles
- slow hairline route reveal + destination glow
- quiet continuation paths from regional hubs to hidden hemisphere
- founder section unchanged from V6

V13: private-services header/layout + concierge public-copy/line-break fix.

## V14 — PRIVATE WAY TO KOREA
- Global map narrative changed from Seoul/global-network wording to Korea-centered private medical access.
- Hero copy: “당신이 어디에 계시든, 한국의 의료는 가까워집니다.”
- Map home label changed from SEOUL to KOREA and moved to a Korea-centered coordinate.
- Supporting labels: PRIVATE CONSULTATION / CURATED MEDICAL ACCESS / CONTINUITY OF CARE.


## V18 — HERO MAP LUXURY
- HERO color system shifted from yellow-brown to graphite black + restrained champagne accents.
- Korea map core reveals `at PRIVÉ` first; KOREA is secondary microcopy.
- All global routes extend outward together in a slow coordinated animation.
- Destination points and labels appear while lines complete, then the network settles quietly with at PRIVÉ remaining as the anchor.
- Hero body line-break fixed so `일정, 통역·체류, 사후관리까지 하나의 흐름으로 조율합니다.` is a dedicated line on desktop.


## V22 hotfix
- Fixed malformed HTML structure at the bottom of index.html.
- `#contact` section is no longer nested inside `#founder`.
- Restored founder detail blocks and separated consultation section back into its own full-width chapter.


## V23 hotfix
- Fixed overlap between the CURATED MEDICAL ACCESS headline and the right-hand program list.
- Rebalanced the two-column grid.
- Split the long second headline line into a controlled third line.
- Reduced only this section's headline scale slightly while preserving the overall UI.


## V24
- PRIVATE HEALTH OFFICE headline changed to:
  - 한 해의 건강을,
  - 하나의 전담 기준으로.
- Removed the long Founder Profile narrative.
- Removed the repeated platform-description block from the Founder section.
- Rebuilt Founder UI around portrait, identity, verified core competencies, business areas, education and certifications.
- Core Competencies reorganized into a calmer 3×2 editorial grid.


## V25
- Removed forced `<br>` line breaks from Founder competency labels.
- Founder Experience headline stays on one line on desktop whenever width permits.
- Competency text now wraps naturally only when the card width requires it.


## 웹사이트 타이포그래피 / 줄바꿈 규칙

- 제목과 본문에 임의의 `<br>` 태그를 넣지 않는다.
- 디자인을 위해 문장을 억지로 2줄·3줄로 나누지 않는다.
- 기본적으로 브라우저의 자연스러운 줄바꿈을 사용한다.
- 한국어는 의미 단위가 깨지지 않도록 `word-break: keep-all`을 기본으로 사용한다.
- 문장 끝 조사·어미나 1~3글자짜리 단어가 다음 줄에 혼자 남는 고아 줄(orphan line)을 허용하지 않는다.
- 예: `기준으 / 로.` 또는 `관리합니 / 다.` 같은 형태는 금지한다.
- 제목이 영역에 맞지 않으면 줄바꿈을 강제로 추가하지 말고 폰트 크기, letter-spacing, max-width, 컬럼 폭을 먼저 조정한다.
- 제목 줄 수는 결과적으로 결정되어야 하며, 코드에서 미리 줄 수를 고정하지 않는다.
- `<span class="title-line">`으로 문장마다 줄을 강제하지 않는다. 꼭 필요한 브랜드 카피에만 예외적으로 사용한다.
- 데스크톱에서는 가능한 한 자연스러운 긴 호흡을 유지하고, 모바일에서만 화면 폭에 맞춰 자연스럽게 줄어들게 한다.
- CSS에서는 `word-break: keep-all`, 필요 시 `text-wrap: balance`를 사용하되 `white-space: nowrap`은 문장이 실제로 충분히 들어갈 때만 사용한다.
- 작업 후 1920px / 1440px / 1280px / 모바일 화면에서 제목 끝에 1~3글자만 떨어진 줄이 없는지 확인한다.
- 줄바꿈이 애매하면 강제로 나누지 않는 쪽을 우선한다.
- 강제 줄바꿈을 선호하지 않는다. 특별한 이유가 없다면 `<br>`을 사용하지 말고, 한 단어나 조사만 다음 줄에 남는 경우 반드시 레이아웃을 수정한다.


## V27
- Fixed THE at PRIVÉ STANDARD section being visually pinned to the top.
- Cause: `.standard-layout` changes `.section-shell` from flex to grid, so `justify-content:center` no longer vertically centered the content.
- Added grid `align-content:center` / `align-items:center`.
- Removed forced title-line spans from the Standard headline; wrapping is now natural.


## V28
- Fixed the `ALL / 전체 의료 접근 분야` English category list wrapping awkwardly.
- Desktop keeps `Brain · Vision · Men · Recovery · Beauty · Wellness` on one line when space permits.
- Smaller screens return to natural Korean-style wrapping rules.


## V29 - Content Depth / Premium Access

### Direction
- at PRIVÉ does not present a partner hospital's assets as its own.
- The website now speaks more clearly about what the client can access through at PRIVÉ:
  curation, specialist access, medical-record preparation, suitability review, continuity and private coordination.
- Medical diagnosis, treatment decisions and clinical eligibility remain with the relevant medical institution and clinician.
- Translation / vehicle / accommodation language stays concentrated in GLOBAL MEDICAL JOURNEY instead of being repeated across medical specialties.

### Detail pages
- Added a program-specific `PRIVATE ACCESS` chapter to all 14 programs.
- Replaced the generic top description with a program-specific premium positioning statement.
- Enriched regenerative medicine, cell/immune care, cancer second opinion, women's health,
  fertility, brain/memory, vision, men's health, recovery/rehab and beauty/wellness with
  concrete, differentiated access descriptions.
- No CHA / partner hospital name, network count, proprietary treatment name or treatment-effect claim is used.


## V30 - Luxury Clinical Storytelling

- Added a new `PRIVATE HEALTH INSIGHT` / program-specific insight chapter to all 14 detail pages.
- The structure is inspired by how premium medical institutions explain:
  why an area matters → what can be reviewed → who it may suit → how the next medical step is connected.
- Wording, visual system and service framing are original to at PRIVÉ.
- No CHA/partner institution name, proprietary program name, hospital network number, equipment claim or treatment-effect claim is reused.
- The visual is an abstract editorial health map rather than an anatomy diagram, so at PRIVÉ remains a luxury healthcare concierge rather than appearing to be a hospital.
- Added subtle motion only to small nodes; reduced-motion users see a static version.


## V31 — Desktop Editorial Restructure
- Home reduced from 10 chapters to 7: Hero / Why / Three Services / Four Signature Journeys / How It Works / Founder / Consultation.
- Removed world map, slogan strip and scroll ornament from the home hero.
- Replaced hero map with a restrained Private Journey File dossier visual.
- Removed customer-facing A/B/C letters.
- Removed standalone Medical Access, Health Office, Journey File and Global Journey chapters from home; their detail remains in program pages.
- Dark chapters reduced to Hero and Signature Journeys.
- Founder reduced to 3 trust pillars plus Selected Credentials.
- Floating concierge remains hidden until after the hero.
- Program detail hero now leads with program name, followed by value statement, description and practical metadata.
- Global map moved to the Global Medical Journey detail page only.
- V30 deep clinical/editorial content remains intact.


## MK1 — Desktop Baseline (2026-08-14)

This build is the agreed first desktop baseline before MK2 content/editorial completion and mobile work.

### MK1 typography changes
- Kept **Bodoni Moda** for the `at` wordmark and selective signature details.
- Added **Cormorant Garamond** as the editorial display serif.
- Changed `Curated Healthcare, Personally Managed.` to the quieter display serif and reduced its scale.
- Shortened Founder proof titles and tuned desktop typography so they stay on one line when space genuinely permits.
- No forced `<br>` was added. Narrower widths return to natural wrapping.

### Next milestone
- MK2: desktop content/editorial completion, service clarity, copy de-duplication, detail-page prioritization, visual rhythm and final QA.
- Mobile work starts only after MK2 desktop is approved.
