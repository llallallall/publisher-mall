import { Component, OnInit } from '@angular/core';
import { DataService, NotificationService, ModalService } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

@Component({
    selector: 'review-list',
    standalone: false,
    template: `
        <vdr-action-bar>
            <vdr-ab-left>
                <vdr-page-title>{{ 'nav.reviews' | translate }}</vdr-page-title>
            </vdr-ab-left>
        </vdr-action-bar>

        <div class="vdr-page-body">
            <vdr-data-table
                [items]="reviews"
                [itemsPerPage]="itemsPerPage"
                [totalItems]="totalItems"
                (pageChange)="setPage($event)"
            >
                <vdr-dt-column>작성일</vdr-dt-column>
                <vdr-dt-column>작성자</vdr-dt-column>
                <vdr-dt-column>상품</vdr-dt-column>
                <vdr-dt-column>평점</vdr-dt-column>
                <vdr-dt-column>내용</vdr-dt-column>
                <vdr-dt-column>출처</vdr-dt-column>
                <vdr-dt-column>상태</vdr-dt-column>
                <vdr-dt-column>관리</vdr-dt-column>

                <ng-template let-review="item">
                    <vdr-dt-row>
                        <vdr-dt-column>{{ review.createdAt | date:'yyyy-MM-dd HH:mm' }}</vdr-dt-column>
                        <vdr-dt-column>{{ review.authorName }}</vdr-dt-column>
                        <vdr-dt-column>{{ review.product.name }}</vdr-dt-column>
                        <vdr-dt-column>
                            <vdr-star-rating [rating]="review.rating"></vdr-star-rating>
                        </vdr-dt-column>
                        <vdr-dt-column>{{ review.body }}</vdr-dt-column>
                        <vdr-dt-column>
                            <vdr-chip>{{ review.source || '직접작성' }}</vdr-chip>
                        </vdr-dt-column>
                        <vdr-dt-column>
                            <vdr-chip [colorType]="review.state === 'Approved' ? 'success' : 'warning'">
                                {{ review.state }}
                            </vdr-chip>
                        </vdr-dt-column>
                        <vdr-dt-column>
                            <div class="btn-group">
                                <button
                                    *ngIf="review.state === 'Pending'"
                                    class="btn btn-sm btn-success"
                                    (click)="approve(review.id)"
                                >승인</button>
                                <button
                                    *ngIf="review.state === 'Approved'"
                                    class="btn btn-sm btn-danger"
                                    (click)="reject(review.id)"
                                >거절</button>
                            </div>
                        </vdr-dt-column>
                    </vdr-dt-row>
                </ng-template>
            </vdr-data-table>
        </div>
    `,
})
export class ReviewListComponent implements OnInit {
    reviews: any[] = [];
    totalItems = 0;
    itemsPerPage = 10;
    currentPage = 1;

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.fetchReviews();
    }

    fetchReviews() {
        const QUERY = gql`
            query GetAllReviews($skip: Int, $take: Int) {
                allProductReviews(skip: $skip, take: $take) {
                    items {
                        id
                        createdAt
                        authorName
                        rating
                        body
                        state
                        source
                        product {
                            name
                        }
                    }
                    totalItems
                }
            }
        `;

        this.dataService.query(QUERY, {
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage
        }).mapStream(data => data).subscribe((data: any) => {
            this.reviews = data.allProductReviews.items;
            this.totalItems = data.allProductReviews.totalItems;
        });
    }

    setPage(event: any) {
        this.currentPage = event.currentPage;
        this.fetchReviews();
    }

    approve(id: string) {
        this.modalService.dialog({
            title: '리뷰 승인',
            body: '선택한 리뷰를 승인하시겠습니까?',
            buttons: [
                { type: 'secondary', label: '취소' },
                { type: 'primary', label: '승인', returnValue: true }
            ]
        }).subscribe(response => {
            if (response) {
                const MUTATION = gql`
                    mutation ApproveReview($id: ID!) {
                        approveReview(id: $id) {
                            id
                            state
                        }
                    }
                `;
                this.dataService.mutate(MUTATION, { id }).subscribe(() => {
                    this.notificationService.success('후기가 승인되었습니다.');
                    this.fetchReviews();
                });
            }
        });
    }

    reject(id: string) {
        this.modalService.dialog({
            title: '리뷰 거절',
            body: '선택한 리뷰를 거절하시겠습니까? 거절된 리뷰는 사용자 화면에 노출되지 않습니다.',
            buttons: [
                { type: 'secondary', label: '취소' },
                { type: 'danger', label: '거절', returnValue: true }
            ]
        }).subscribe(response => {
            if (response) {
                const MUTATION = gql`
                    mutation RejectReview($id: ID!) {
                        rejectReview(id: $id) {
                            id
                            state
                        }
                    }
                `;
                this.dataService.mutate(MUTATION, { id }).subscribe(() => {
                    this.notificationService.error('후기가 거절되었습니다.');
                    this.fetchReviews();
                });
            }
        });
    }
}
