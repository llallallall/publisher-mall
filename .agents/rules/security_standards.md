### 기술 표준 및 규정 (Standards)
### 위치: .agents/rules/security_standards.md
### 내용: "보안 사고를 어떻게 방지하는가?"에 대한 전역 보안 수칙.

# Security & Secret Management Standards

본 문서는 데브아울스 프로젝트의 보안 무결성을 유지하기 위한 핵심 규정을 정의합니다. 모든 에이전트는 코드를 작성할 때 다음 수칙을 반드시 준수해야 합니다.

## 1. 하드코딩 금지 (Zero Hardcoding Policy)
*   **대상**: DB 비밀번호, API Secret Key, 서비스 계정 정보, 클라우드 접근 권한 등 모든 민감한 정보.
*   **규칙**: 소스 코드(`src/`, `api/`, `storefront/` 등) 내에 어떠한 형태의 하드코딩된 Secret 정보도 포함되어서는 안 됩니다.
*   **사용법**: 반드시 `.env` 환경 변수 또는 시스템 환경 변수(`process.env`)를 사용해야 합니다.

## 2. 환경 변수 관리 (Environment Segregation)
*   **`.env.example` 제공**: 새로운 환경 변수를 추가할 때, 실제 값은 제외하고 변수명만 기재한 `.env.example` 파일을 공유하여 팀원간 싱크를 맞춥니다.
*   **Git Exclusion**: 민감한 실제 값이 포함된 `.env` 파일은 절대로 Git 저장소에 커밋하지 않습니다. (`.gitignore` 필수 포함)

## 3. API 및 통신 보안
*   **클라이언트 노출 방지**: 브라우저(Front-end)에서 노출되어서는 안 되는 Secret 키는 반드시 Nuxt Server Routes(`server/api`) 또는 백엔드 API 서버를 통해서만 처리합니다.
*   **Public/Secret 구분**: 외부 API 사용 시 클라이언트용(Public)과 서버용(Secret) 키를 명확히 구분하여 사용합니다.

---

> [!CAUTION]
> **보안 위반 시 조치**: 하드코딩된 Secret 정보가 포함된 코드가 형상 관리 시스템에 감지될 경우, 해당 PR은 반려되며 즉시 해당 Secret 정보를 무효화(Revoke)하고 재생성해야 합니다.
