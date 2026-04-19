# 🔐 Publisher Mall: Test Credentials

본 프로젝트의 원활한 에이전트 자동화 및 테스트를 위해 다음의 공용 테스트 계정을 사용한다.

## 1. 관리자 페이지 (Admin UI)
- **URL**: `http://localhost:4000/admin`
- **ID**: `admin`
- **PW**: `admin`
- **용도**: 상품 관리, 주문 내역 확인, 시스템 설정 변경 등

## 2. 쇼핑몰 (Storefront)
- **URL**: `http://localhost:3001`
- **ID**: `test@devowls.io` (기본 테스트 계정)
- **PW**: `test1234`
- **용도**: 구매 프로세스 테스트, 마이페이지(디지털 자료함) 확인

> [!CAUTION]
> **보안 주의**: 위 계정은 로컬 개발 및 스테이징 환경 전용이다. 운영 환경(Production) 배포 시에는 반드시 별도의 보안 정책을 적용하고 이 규칙을 업데이트해야 한다.

## 3. 기타 서비스
- **Supabase**: 전용 대시보드 및 서비스 롤 키는 `.env` 파일 참조.

---
*Last Updated: 2026-04-18 by Antigravity*
