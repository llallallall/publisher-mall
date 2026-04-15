import { LanguageCode } from '@vendure/core';

export const initialData: any = {
    defaultLanguage: LanguageCode.ko,
    defaultZone: 'Asia',
    taxCategories: [
        { name: 'Standard Tax', isDefault: true },
    ],
    shippingMethods: [
        { name: 'Standard Shipping', description: 'Standard shipping' },
    ],
    countries: [
        { name: 'South Korea', code: 'KR', zone: 'Asia' },
    ],
    collections: [
        {
            name: 'Mock Exams',
            filters: [
                { code: 'facet-value-filter', args: { facetValueIds: ['1'], containsAny: false } },
            ],
        },
    ],
    paymentMethods: [
        {
            name: 'Standard Payment',
            code: 'standard-payment',
            description: 'Standard payment method for development',
            handler: { code: 'dummy-payment-handler', args: [] },
        },
    ],
};
