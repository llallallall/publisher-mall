export const extensionRoutes = [  {
    path: 'extensions/product-reviews',
    loadChildren: () => import('./extensions/product-reviews/reviews-ui.module').then(m => m.ReviewsUiModule),
  }];
