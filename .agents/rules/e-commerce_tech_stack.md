### 기술 표준 및 규정 (Standards)
### 위치: .agents/rules/e-commerce_tech_stack.md
### 내용: "왜 이 기술을 사용하는가?"에 대한 표준 가이드라인. (예: Vendure를 써야 하는 이유, Nuxt 4 환경 설정 규칙 등)

# E-commerce Tech Stack Standards: Publisher Mall

본 문서는 (주)데브아울스의 이커머스 개발 표준을 정의하며, 본 프로젝트의 기술적 의사결정 근거를 담고 있습니다.

## 1. Backend: Vendure (Headless Commerce)
*   **선정 이유**: 300만 원 예산의 MVP에서 주문, 결제, 상품 관리 로직을 직접 개발하는 비용을 절감하고, 검증된 Admin UI를 즉시 확보하기 위함.
*   **특징**: TypeScript 기반의 확장성, GraphQL API 표준 지원.

## 2. Database: Supabase (PostgreSQL)
*   **선정 이유**: MVP 단계에서 서버 가동 및 관리 비용을 최소화하고, 실시간성 및 안정적인 데이터 저장을 위해 관리형 PostgreSQL인 Supabase를 채택. (초기 계획된 MySQL 대비 인프라 관리 부담이 적음)
*   **연결**: IPv4 지원 전문 호스트(Pooler)를 통해 Vendure와 연결.

## 3. Frontend: Nuxt 4 + Storefront UI
*   **Framework**: Nuxt 4 (`compatibilityVersion: 4`)를 사용하여 최신 웹 표준과 높은 성능(SSR/ISR) 확보.
*   **UI Library**: Nuxt UI 사용을 지양하고 **Storefront UI**를 채택. (데브아울스 UI/UX 표준 준수를 위한 래퍼 컴포넌트 방식 사용)
*   **Styling**: **Tailwind CSS v4** (`@tailwindcss/vite`)를 사용하여 차세대 빌드 성능 및 정교한 스타일링 구현.

## 4. Design Standards: Basalt & Blueprint
*   **Basalt Philosophy**: 모든 UI Card 및 Button에 `rounded-3xl` 이상의 부드러운 곡률을 적용하여 학습자에게 심리적 안정감 제공.
*   **Blueprint Grid**: 배경에 5% 농도의 미세 격자를 배치하여 학문적 정밀함과 신뢰도 시각화.

## 5. Deployment & Security
*   **Storefront**: Vercel (Serverless Edge) 배포.
*   **API Server**: 지속 실행(Long-running)이 필요한 Vendure의 특성에 맞춰 별도의 VPS 또는 전용 컨테이너 환경에 배포.
*   **Security**: 모든 자료실 파일은 유효기간이 포함된 **Signed URL**을 통해서만 접근 가능하도록 설계.
