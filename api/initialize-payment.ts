import { bootstrap, RequestContextService, PaymentMethodService, ChannelService, LanguageCode } from '@vendure/core';
import { config } from './vendure-config';

async function initPayment() {
    console.log('--- Ensuring Portone Payment Method is Enabled ---');
    const scriptConfig = {
        ...config,
        plugins: config.plugins?.filter(p => !((p as any).name || (p as any).plugin?.name || (p as any).constructor?.name || '').includes('AdminUiPlugin')) || [],
        apiOptions: { ...config.apiOptions, port: 4001 }
    };

    const app = await bootstrap(scriptConfig);
    const paymentMethodService = app.get(PaymentMethodService);
    const ctxService = app.get(RequestContextService);

    const ctx = await ctxService.create({ apiType: 'admin' });
    const methods = await paymentMethodService.findAll(ctx);
    const existing = methods.items.find(m => m.code === 'portone-payment');

    if (existing) {
        console.log('UPDATING existing payment method...');
        await paymentMethodService.update(ctx, {
            id: existing.id,
            enabled: true,
            handler: {
                code: 'portone-payment',
                arguments: [
                    { name: 'merchantId', value: 'imp00000000' },
                    { name: 'apiKey', value: 'api_key' },
                    { name: 'apiSecret', value: 'api_secret' },
                ],
            },
        });
        console.log('Payment method "portone-payment" updated and enabled.');
    } else {
        await paymentMethodService.create(ctx, {
            code: 'portone-payment',
            enabled: true,
            handler: {
                code: 'portone-payment',
                arguments: [
                    { name: 'merchantId', value: 'imp00000000' },
                    { name: 'apiKey', value: 'api_key' },
                    { name: 'apiSecret', value: 'api_secret' },
                ],
            },
            translations: [{
                languageCode: LanguageCode.ko,
                name: 'Portone 결제',
                description: '신용카드 및 간편결제',
            }],
        });
        console.log('Payment method "portone-payment" created successfully.');
    }

    await app.close();
    process.exit(0);
}

initPayment().catch(err => {
    console.error(err);
    process.exit(1);
});
