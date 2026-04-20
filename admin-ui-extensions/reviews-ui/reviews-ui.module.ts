import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, addNavMenuItem } from '@vendure/admin-ui/core';
import { ReviewListComponent } from './review-list.component';

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
    providers: [
        addNavMenuItem(
            {
                id: 'reviews-custom',
                label: 'nav.reviews',
                routerLink: ['/extensions', 'product-reviews'],
                icon: 'star',
            },
            'customers',
        ),
    ],
})
export class ReviewsUiModule {}
