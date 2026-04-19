# 📜 TASK_HISTORY (Publisher Mall)

| 날짜 | 작업 내용 | 이유/비고 |
| :--- | :--- | :--- |
| 2026-04-15 | **Supabase PostgreSQL 전면 전환** | SQLite 탈피 및 상용 인프라(Mumbai Pooler) 안착 |
| 2026-04-15 | **인프라 포트 재배치 (3001, 3002, 3003)** | API(3002), Storefront(3001), Admin(3003) 충돌 해결 |
| 2026-04-15 | **환경 정화 (Ghost Cleanup)** | 생성 오류로 인한 `개선구조` 및 불필요한 캐시/파일 제거 |
| 2026-04-15 | **프리미엄 디자인 시스템(Basalt) 구축** | 학술적 권위를 위한 Navy/Gold 테마 및 Playfair Display 적용 |
| 2026-04-15 | **UI 컴포넌트 고도화 (Card/Button/Hero)** | 상용 수준의 호버 효과 및 아카이브 레이아웃 구현 |
| 2026-04-15 | **상용 데이터 바인딩** | 국어/수학/영어 모의고사 실제 데이터(Vendure) 연동 완료 |
| 2026-04-16 | **디지털 자료 활성화 시스템 구현** | 결제 완료 시 권한 자동 부여 및 번들 상품 재귀 활성화 로직 완성 |
| 2026-04-16 | **포트원(Portone) 결제 연동** | usePayment 컴포저블 제작 및 백엔드 웹훅 처리(Vendure v3) 완료 |
| 2026-04-16 | **Basalt 디자인 시스템 고도화** | Tailwind v4 기반 Navy/Gold 테마 및 글래스모피즘 UI 확립 |
| 2026-04-16 | **환경 격리 및 포트 최적화** | API(4000), Storefront(5000) 포트 이동으로 환경 충돌 전면 해결 |
| 2026-04-18 | **환경 동기화 및 스키마 정정** | Port 4000 고정 및 totalItems -> totalQuantity 전환으로 v3 호환성 확보 |
| 2026-04-18 | **E2E 검증 Phase 1 및 웹훅 수신 확인** | 상품 노출 복구, 장바구니 흐름 검증, 포트원 웹훅(paid) 수신 시뮬레이션 및 Order Settle 상태 전환 성공 |
| 2026-04-18 | **디지털 자료 활성화 로직 디버깅** | 활성화 시 `ProductVariant.customFields` 조회 방식 이슈 발견 및 로그 추가 |
| 2026-04-18 | **디지털 자료 활성화 및 Storage 연동 완료** |  조회 버그 수정, Supabase Signed URL 구현, Admin UI GlobalFlag 에러 해결 |
| 2026-04-18 | **디지털 자료 활성화 및 Storage 연동 완료** | ProductVariant.customFields 조회 버그 수정, Supabase Signed URL 구현, Admin UI GlobalFlag 에러 해결 |
| 2026-04-18 | **상세 페이지 및 UX 고도화 완료** | 상품 상세(), 토스트 알림, 페이지 트랜지션, 로그인 인증 제한 해제 |
| 2026-04-18 | **Phase 2 & 3: UX 및 핵심 비즈니스 로직 완성** | [slug].vue 상세 페이지, 전역 토스트, 인증 필수 해제, 포트 및 계정 규약 수립 완료 |
| 2026-04-18 | **디지털 자료 활성화 검증** | DigitalMaterialPlugin 버그 수정 및 구매 시뮬레이션(v3) 성공 확인 |
| 2026-04-18 | **포트 및 구동 규약 수립** | .agents/rules/port_conventions.md 신설 및 포트 체계 표준화 |
| 2026-04-18 | **테스트 계정 표준화** | .agents/rules/test_accounts.md 신설 (Admin/Storefront 계정 명문화) |
| 2026-04-18 | **디지털 자료 활성화 최종 검증 및 버그 수정** | EventBus 기반 E2E 테스트 성공, Entity 생성자(Object.assign) 버그 수정 완료 |
| 2026-04-18 | **필수 UX 고도화 및 데이터 연동** | 체크아웃 페이지 인증 데이터 연동 및 로그인 가드 구현 |
| 2026-04-18 | **구매 절차 브라우저 검증 완료** | test@devowls.io로 로그인→상품선택→결제 전과정 완료, PaymentSettled 전환 후 digital_activation 레코드(ID:3) 자동 생성 확인 |
| 2026-04-19 | **상품 이미지 업로드 및 연결 완료** | AI 생성 이미지 3종(국어/수학/영어) → Vendure AssetServer 업로드(Asset ID: 1,2,3) → 상품 6종 featuredAsset 연결, HTTP 200 서빙 확인 |
| 2026-04-19 | **디지털 자산 Supabase 이관 완료** | MP3/PDF 파일을 Supabase `digital-assets` 버킷으로 이관. DB에는 버킷 내 상대 경로만 저장. Shop API 호출 시 Supabase Signed URL(1시간 유효) 자동 생성 로직 구현 및 검증 완료 (@Ctx 인젝션 및 지연 초기화 버그 수정 포함) |
| 2026-04-19 | **번들 프라이싱 엔진 구현 완료** | `bundleInfo` GQL 필드 추가. 구성 상품들의 정가 합계(`regularPrice`) 대비 번들 가격의 할인율 및 절약 금액을 실시간 계산하는 리졸버(ProductVariantService 연동) 구현 완료 |
| 2026-04-19 | **주문 알림 시스템 시뮬레이션 완료** | `NotificationPlugin`을 통해 결제 완료 시 카카오 알림톡 및 이메일 발송 자동화 로직 구현 (로그 시뮬레이션) |
