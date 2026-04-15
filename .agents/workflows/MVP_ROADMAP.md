---
description: 
---

# Workflow: MVP Rapid Development Roadmap

## Phase 1. Database & Core (Week 1)
- **MySQL Schema**: `products`, `orders`, `users`, `files` 테이블 설계 및 연결
- **Nuxt 4 Setup**: `app/` 구조 및 테마 컬러 설정 (Navy/Gold)

## Phase 2. 필수 기능 구현 (Week 2-3)
- **Shopping Flow**: 상품 상세 -> 장바구니 -> 가상 결제 완료 흐름 구현
- **Archive System**: 권한 기반의 자료실 파일 다운로드 로직 구축 [cite: 2026-04-15]

## Phase 3. 관리자 대시보드 (Week 4)
- **Admin UI**: 상품 등록 및 주문 현황을 한눈에 보는 목업 대시보드 구축
- **Review Scraping**: 외부 플랫폼 후기 데이터를 수동/자동으로 통합하는 기능 구현 [cite: 2026-04-15]

## Phase 4. 안정성 및 검수
- **SSR Guard**: 하이드레이션 오류 및 `window` 참조 오류 전수 체크
- **Performance**: `useFetch` 페이로드 최적화 및 이미지 WebP 변환 확인