# 🚀 FUTURE_TASKS: Final Verification & Deployment

인프라와 핵심 비즈니스 로직(디지털 자료, 결제)이 완성되었습니다. 이제는 상용 런칭을 위한 검증과 배포에 집중합니다.

## 1. 시스템 최종 검증 (Verification Phase)
- [x] **웹훅 수신 및 결제 완료 상태 전환**: 포트원 웹훅 페이로드 수신 및 Vendure Order -> PaymentSettled 전환 성공.
- [ ] **디지털 자료 활성화 로직 픽스**: `DigitalMaterialPlugin`에서 `ProductVariant.customFields`를 정상적으로 읽어와 `DigitalActivation` 테이블에 기록하도록 수정.
- [ ] **My Materials UI 검증**: 권한 부여된 자료가 다운로드 페이지에 정상 노출되는지 확인.
- [ ] **모바일 환경 최적화**: iOS/Android 브라우저에서의 포트원 결제창 팝업 및 리다이렉션 처리 확인.

## 2. 콘텐츠 및 스토리지 전문화 (Content & Storage)
- [ ] **Supabase Storage 연동 (Phase 6 반영)**: `.env`에 추가된 `SUPABASE_BUCKET=digital-assets`를 활용하여 디지털 에셋(PDF, MP3)을 Supabase 버킷에 업로드하고 Signed URL로 서빙하는 로직 구현.
- [ ] **상품 상세 페이지 완성**: 과목별 탭 메뉴(소개/이미지) 및 아카이브 미리보기(PDF Viewer) 연동.
- [ ] **브랜드 자산화**: 고해상도 제품 이미지 및 기관 제휴 로고 배치.

## 3. 사용자 경험 고도화 (UX Refinement)
- [ ] **로딩 및 트랜지션**: 페이지 이동 시 Basalt 특유의 큐빅 베지어 애니메이션 및 스켈레톤 UI 완성.
- [ ] **알림 시스템**: 결제 완료 및 자료 활성화 성공 시 사용자 알림(Toast) UI 구현.

## 4. 상용 배포 (Deployment)
- [ ] **Supabase DB 최종 스키마 동기화**: 로컬 개발 중 변경된 커스텀 필드 및 엔티티 최종 마이그레이션.
- [ ] **Vercel/Cloudflare 배포**: Storefront의 엣지 배포 및 도메인 SSL 설정.

## ⚠️ Known Issues (Unresolved)
- [ ] **Admin UI `GlobalFlag` 에러**: Admin UI에서 주문 상세 조회 시 `Enum "GlobalFlag" cannot represent value: "true"` GraphQL 에러 발생으로 인해 접근 불가 현상.
- [ ] **회원가입/로그인 인증 흐름**: 기본적으로 이메일 인증이 활성화되어 있어 가입 직후 로그인이 차단됨(`Please verify this email address`). 인증 메일 발송 UI 처리 혹은 옵션 해제 필요.
- [ ] **ProductVariant customFields 미조회 버그**: 주문 완료(PaymentSettled) 이벤트에서 `ProductVariant`의 `customFields.digitalMaterialUrl`을 제대로 읽어오지 못해 `DigitalActivation` 테이블에 데이터가 적재되지 않는 문제.

---
**Tip**: "검증 Phase 작업부터 재개해줘"라고 요청하시면 즉시 마지막 테스트를 진행합니다. 🦉
