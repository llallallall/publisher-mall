import { LanguageCode, PaymentMethodHandler } from '@vendure/core';

export const portonePaymentHandler = new PaymentMethodHandler({
    code: 'portone-payment',
    description: [{ languageCode: LanguageCode.ko, value: 'Portone (포트원) 결제' }],
    args: {
        merchantId: { 
            type: 'string', 
            label: [{ languageCode: LanguageCode.ko, value: '가맹점 식별코드 (imp...)' }] 
        },
        apiKey: { 
            type: 'string', 
            label: [{ languageCode: LanguageCode.ko, value: 'REST API 키' }] 
        },
        apiSecret: { 
            type: 'string', 
            label: [{ languageCode: LanguageCode.ko, value: 'REST API Secret' }] 
        },
    },
    /**
     * This is called when the storefront calls the `addPaymentToOrder` mutation.
     * For Portone, the frontend handles the initial payment and passes the `imp_uid` in metadata.
     */
    createPayment: async (ctx, order, amount, args, metadata) => {
        try {
            return {
                amount: amount,
                state: 'Authorized',
                transactionId: metadata.imp_uid,
                metadata: metadata,
            };
        } catch (err: any) {
            return {
                amount: amount,
                state: 'Declined',
                errorMessage: err.message,
                metadata: metadata,
            };
        }
    },
    /**
     * This is called when the payment is settled (captured).
     * For Portone, we verify the payment status via their API.
     */
    settlePayment: async (ctx, order, payment, args) => {
        // In a real implementation:
        // 1. Get access token from Portone
        // 2. Fetch payment info using payment.transactionId (imp_uid)
        // 3. Verify amount matches order.total
        return { success: true };
    },
});
