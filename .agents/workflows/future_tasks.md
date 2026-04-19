# 🔮 Future Tasks: Publisher Mall

## 1. 결제 및 자료 활성화 (Payment & Activation)
- [ ] **E2E 결제 테스트 (Portone)**: 실제 결제창 호출 및 `OrderStateTransitionEvent`를 통한 `DigitalMaterialPlugin` 자동 활성화 로직 전수 검사.
- [ ] **모바일 대응**: iOS/Android 브라우저에서의 포트원 결제 팝업 차단 대응 및 리다이렉션(`m_redirect_url`) 처리.

## 2. 콘텐츠 및 브랜딩 (Content & Branding)
- [ ] **실제 저작물 배치**: Supabase Storage에 고해상도 PDF 및 MP3 샘플 업로드 후 상품 Variant에 연결.
- [ ] **브랜드 자산화**: 출판사 로고, 저자 약력 섹션 추가 및 SEO 메타 데이터 고도화.

## 3. 안정성 및 배포 (Stability & Deployment)
- [ ] **에러 핸들링**: 결제 실패 또는 자료 활성화 오류 시 사용자 알림 및 로그 수집 체계 강화.
- [ ] **운영 환경 배포**: Supabase DB 최종 스키마 동기화 및 Vercel/Cloudflare 배포 설정.

## ✅ Completed Tasks (Current Session)
- [x] 상품 상세 페이지 (`[slug].vue`) UI 및 탭 기능 구현.
- [x] 전역 토스트 알림 시스템 (`AppToast.vue`, `useToast.ts`) 구축.
- [x] 포트(`4000`, `3001`) 및 테스트 계정 규약 수립 (`.agents/rules/`).
- [x] Vendure 이메일 인증 필수 옵션 해제 (`requireVerification: false`).
- [x] `DigitalMaterialPlugin` 권한 생성 및 Signed URL 서빙 오류 수정.
