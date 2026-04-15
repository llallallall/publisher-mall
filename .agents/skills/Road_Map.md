### 실행 로드맵 및 스킬 (Execution)
### 위치: .agents/skills/Road_Map.md (방금 작성한 곳)
### 내용: "어떻게 구현하는가?"에 대한 단계별 실행 로드맵 및 상세 구현 기술.

# Tech Stack & Implementation Roadmap: Publisher Mall MVP

"(주)데브아울스의 표준 기술 스택과 비즈니스 로직 최적화 방향을 정의합니다."

## 1단계: Vendure 코어 서버 구동 및 마이그레이션
가장 먼저 Vendure 엔진을 Supabase DB와 연결하여 쇼핑몰의 '두뇌'를 활성화해야 합니다.

- **DB 스키마 생성**: Vendure 설정 파일(`vendure-config.ts`)에서 DB 타입을 `postgres`로 설정하고 `.env` 정보를 연결한 뒤, Supabase에 기본 테이블을 생성합니다.
- **Admin UI 접속**: 서버 실행 후 `localhost:3002/admin`에 접속하여 초기 상품 카테고리(모의고사, 번들, 디지털 자료)를 설정합니다.
- **기본 설정**: 출판사 비즈니스에 맞는 배송 방법(택배/디지털 다운로드)과 세금 설정을 마칩니다.

## 2단계: 핵심 커스텀 플러그인 개발 (번들 및 자료실)
출판사 요구사항의 핵심인 **'번들 판매'**와 **'보안 자료실'** 기능을 Vendure 플러그인으로 구현합니다.

- **Bundle Plugin**: 하나의 상품(Product) 구매 시 여러 구성품(실물 도서 + PDF)이 자동으로 주문 목록에 포함되도록 하는 로직을 작성합니다.
- **Digital Asset Protection**: 주문 상태가 `PaymentSettled`(결제완료)가 되는 순간, Supabase Storage의 특정 파일에 접근할 수 있는 권한을 유저에게 부여하는 Webhook/이벤트를 설정합니다.

## 3단계: Nuxt 4 프론트엔드 개발 (The 'Solid Serenity' UI)
Vendure의 GraphQL API를 사용하여 차장님이 구상하신 프리미엄 화면을 구현합니다.

- **GraphQL 클라이언트 설정**: `urql` 또는 `Apollo`를 사용하여 Vendure 서버와 통신할 수 있는 레이어를 구축합니다.
- **핵심 페이지 구현**:
    - **홈/리스트**: `rounded-3xl` 곡률이 적용된 상품 카드와 `Blueprint Grid` 배경을 입힙니다.
    - **체크아웃**: 포트원(PortOne) 등 PG사 연동 코드를 삽입하여 결제 흐름을 완성합니다.
    - **자료실 (My Archive)**: 결제된 유저가 `useFetch`를 통해 Signed URL을 요청하고 파일을 다운로드받는 인터페이스를 만듭니다.

## 4단계: 외부 후기 수집 엔진 연동
의뢰인이 가장 매력을 느낄 '리뷰 통합 관리' 기능을 활성화합니다.

- **Scraper 연동**: 관리자 페이지에서 교보문고 등의 URL을 입력하면 데이터를 긁어와 Vendure의 Review 엔티티로 저장하는 API를 호출합니다.
- **통합 노출 로직**: 자사 리뷰와 외부 리뷰를 구분하는 아이콘을 달아 상품 상세 페이지에 배치합니다.

## 5단계: Vercel 배포 및 최종 검수
서버리스 환경인 Vercel에 최적화하여 배포를 마무리합니다.

- **배포 분리**: Nuxt 4 앱은 Vercel에, Vendure 서버(Node.js)는 별도의 VPS나 Railway 등 지속 실행이 가능한 환경에 배포합니다. (Vercel은 서버리스라 Vendure 코어 서버를 올리기엔 부적합할 수 있습니다.)
- **보안 검수**: Supabase RLS가 제대로 작동하여 타인의 주문 내역을 볼 수 없는지 최종 확인합니다.

---

> [!TIP]
> **전략적 집중**: Vendure의 기본 Admin UI를 최대한 활용하고, 프론트엔드(Nuxt 4)의 디자인 품질에만 80%의 에너지를 집중하는 것이 고객의 높은 만족도를 이끌어내는 핵심 비결입니다.
