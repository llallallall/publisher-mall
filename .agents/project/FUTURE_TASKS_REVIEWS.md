# 🚀 Future Task: Vendure Admin UI Integration (Reviews)

## 📌 현재 상태
- **백엔드**: `SeodamReviewsPlugin` 안정화 완료 (`externalId`, `source` 등 커스텀 필드 포함).
- **프론트엔드**: `ReviewListComponent` 컴포넌트 개발 완료 (레이아웃 표준화 적용).
- **진행 중단 사유**: `shared` 모듈의 루트 라우팅 침범 이슈와 `lazy` 모듈의 메뉴 미노출 이슈 간의 교착 상태 및 벤듀어 컴파일러 캐시 충돌.

## 🛠️ 향후 해결을 위한 가이드 (다른 에이전트 참고용)

### 1. 모듈 분리 전략 (The Golden Standard)
반드시 두 개의 NgModule로 분리하여 등록해야 합니다:
- **`ReviewsSharedModule`**: `addNavMenuItem` 프로바이더만 포함. `vendure-config.ts`에서 **`type: 'shared'`**로 등록.
- **`ReviewsUiModule`**: `RouterModule.forChild`와 `ReviewListComponent` 포함. `vendure-config.ts`에서 **`type: 'lazy'`**로 등록.
- **핵심**: 동일한 `reviews-ui.module.ts` 파일 내에 두 클래스를 선언하고 각각 호출하십시오.

### 2. 라우팅 네임스페이스
- `ReviewsUiModule` (Lazy)의 `RouterModule` 설정 시 `path: ''`를 사용하지 말고, 명시적인 서브 경로(예: `path: 'manage'`)를 사용하거나, `registerRouteComponent`를 사용하되 `id` 경로와의 정렬을 확인하십시오.

### 3. 빌드 오류 시 긴급 처방
- 코드를 수정했음에도 `TS2305` 등의 에러가 발생하면, `shared-extensions.module.ts` (자동 생성 파일)가 오염된 것입니다.
- 반드시 `compiled-admin-ui` 폴더를 삭제하고 서버를 재시작하십시오.

---
**기록일**: 2026-04-21
**작업자**: Antigravity (Agent)
