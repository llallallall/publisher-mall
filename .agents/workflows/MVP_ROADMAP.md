# Workflow: Publisher Mall MVP Rapid Development Roadmap (v2026.04)

지식 자산을 유통하는 상용 프리미엄 출판몰을 구축하기 위한 다단계 실행 전략입니다.

## Phase 1. Infrastructure & Core System (Completed) ✅
- [x] **Database Architecture**: Supabase PostgreSQL (Mumbai Region Pooler) 인프라 안착
- [x] **Headless Backend**: Vendure v3 기반의 고도화된 이커머스 엔진 구축
- [x] **Port Sync**: Shop API(3002), Admin UI(3003), Storefront(3001) 환경 조율
- [x] **Storefront Engine**: Nuxt 4 (compatibility mode), Tailwind v4, URQL 정밀 연동

## Phase 2. Premium Design & UI/UX (Completed) ✅
- [x] **Design Tokens**: `Antigravity Charcoal & Blue` 프리미엄 시스템 정립 (Lucid Depth 적용)
- [x] **Archival Layout**: 기록 보관소(Index) 컨셉의 미니멀리즘 히어로 섹션 및 정제된 그리드 구현
- [x] **Premium Components**: Antigravity 명세가 반영된 `AppCard`, `AppButton` 고도화 완료
- [x] **Data Binding**: 백엔드 상용 데이터(국/수/영 모의고사) 실시간 바인딩 완료

## Phase 3. Digital-Physical Bundle Logic (Completed) ✅
- [x] **Asset Mapping System**: 실물 도서 구매 시 디지털(PDF, MP3) 자료 자동 권한 부여 로직
- [x] **Bundle Pricing Strategy**: 복합 상품에 대한 할인 계산 엔진(Regular vs Bundle) 및 API 확장 완료
- [x] **Digital Locker**: 구매자 전용 고성능 파일 다운로드 센터(Archive) 구축 완료

## Phase 4. Payment & Order Fulfillment (In Progress) 🏗️
- [x] **Portone Gateway**: 국내 신용카드 및 페이 연동 연동 완료
- [x] **Checkout Optimization**: 주소 검색, 배송 정보 입력, 최종 주문 요약 및 인증 연동 완료
- [x] **Post-Purchase Flow**: 결제 완료 후 카카오 알림톡/메일링 자동 트리거 시뮬레이션 구현 완료

## Phase 5. Identity & Security ✅
- [x] **Supabase Auth Linkage**: 소셜 로그인 시스템과 Vendure Customer 레코드 자동 매핑 완료
- [x] **Identity Bridge**: Supabase JWT를 기반으로 한 하이브리드 인증 전략(Strategy) 구축 완료
- [ ] **Rate Limiting**: API 요청 속도 제어 및 보안 강화
- [ ] **Admin Automation**: 대규모 상품군 관리를 위한 Vendure Admin UI 대시보드 커스텀

## Phase 6. Performance & Scale-up 🚀
- [ ] **SEO Strategy**: 학술적 검색 권위 확보를 위한 메타데이터 및 구조화된 데이터 최적화
- [ ] **Speed Optimization**: 이미지 WebP 변환, Nitro 엔진 최적화, SSR 하이드레이션 검수