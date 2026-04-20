import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, addNavMenuItem } from '@vendure/admin-ui/core';
import { ReviewListComponent } from './review-list.component';

/**
 * 지연 로딩(Lazy) - 실제 리뷰 화면용
 */
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: ReviewListComponent,
                data: { breadcrumb: 'nav.reviews' },
            },
        ]),
    ],
    declarations: [ReviewListComponent],
})
export class ReviewsUiModule {}

/**
 * 즉시 로딩(Shared) - 좌측 메뉴 등록용
 */
@NgModule({
    imports: [SharedModule],
    providers: [
        addNavMenuItem({
            id: 'seodam-reviews',
            label: '리뷰 관리',
            routerLink: ['/extensions', 'seodam-reviews'],
            icon: 'star',
        }, 'customers'),
    ],
})
export class ReviewsSharedModule {}
