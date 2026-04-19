# 🏰 Publisher Mall: Port & Execution Conventions

본 프로젝트의 일관된 구동 환경을 위해 다음의 포트 체계와 명령어를 엄격히 준수한다.

## 1. 포트 관리 (Port Allocation)

| 서비스 | 포트 | 용도 |
| :--- | :--- | :--- |
| **Vendure API** | `4000` | Shop/Admin API 메인 서버 |
| **Admin UI** | `3003` | 관리자 대시보드 (Direct Access) |
| **Storefront** | `3001` | Nuxt 쇼핑몰 프론트엔드 |

> [!IMPORTANT]
> **포트 3000 사용 금지**: 다른 로컬 프로젝트와의 충돌 방지를 위해 기본 3000번 포트는 절대 사용하지 않으며, 쇼핑몰은 항상 `3001`번을 사용한다.

## 2. 구동 명령어 (Standard Commands)

모든 명령어는 프로젝트 루트 디렉토리에서 실행한다.

- **쇼핑몰 구동**: 
  ```bash
  npm run dev:storefront
  ```
- **API 서버 및 관리자 UI 구동**: 
  ```bash
  npm run dev:api
  ```
- **빌드 (Production)**:
  ```bash
  npm run build:api
  npm run build:storefront
  ```

## 3. 설정 파일 동기화 지침

포트 설정을 변경해야 할 경우 다음 파일들을 동시에 수정해야 한다.
1.  `.env`: `API_URL`, `STOREFRONT_PORT`, `ADMIN_PORT` 수정
2.  `api/vendure-config.ts`: `apiOptions.port`, `cors.origin` 수정
3.  `storefront/nuxt.config.ts`: `devServer.port` 수정

---
*Last Updated: 2026-04-18 by Antigravity*
