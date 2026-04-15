import { bootstrap, ProductService, ProductVariantService, RequestContextService, LanguageCode, ChannelService } from '@vendure/core';
import { config } from './vendure-config';

async function runPopulate() {
    const app = await bootstrap(config);
    const productService = app.get(ProductService);
    const variantService = app.get(ProductVariantService);
    const ctxService = app.get(RequestContextService);
    const channelService = app.get(ChannelService);

    // Get default channel and context
    const ctx = await ctxService.create({ apiType: 'admin' });

    console.log('--- Custom Population Starting ---');

    const sampleProducts = [
        {
            name: '2026 국어 모의고사 (Vol.1)',
            slug: '2026-korean-mock-1',
            description: '최신 수능 트렌드를 완벽 반영한 2026학년도 대비 국어 프리미엄 모의고사입니다.',
            price: 24500,
        },
        {
            name: '2026 수학 가형 번들 (교재+PDF)',
            slug: '2026-math-bundle',
            description: '실물 교재 3권과 PDF 학습 자료가 포함된 한정판 통합 패키지입니다.',
            price: 32000,
        },
        {
            name: '영어 듣기 평가 MP3 (디지털)',
            slug: 'english-listening-mp3',
            description: '언제 어디서나 학습 가능한 고음질 영어 듣기 평가 연습용 디지털 오디오 파일입니다.',
            price: 9900,
        }
    ];

    for (const p of sampleProducts) {
        try {
            const product = await productService.create(ctx, {
                enabled: true,
                translations: [{
                    languageCode: LanguageCode.ko,
                    name: p.name,
                    slug: p.slug,
                    description: p.description,
                }],
            });

            await variantService.create(ctx, [{
                productId: product.id,
                sku: p.slug.toUpperCase(),
                price: p.price,
                translations: [{ languageCode: LanguageCode.ko, name: 'Standard' }],
                stockOnHand: 100,
                trackInventory: true as any, 
            }]);
            console.log(`Created product: ${p.name}`);
        } catch (e: any) {
            console.log(`Skipping or failed to create ${p.name}: ${e.message}`);
        }
    }

    console.log('--- Custom Population Finished ---');
    await app.close();
    process.exit(0);
}

runPopulate().catch(err => {
    console.error(err);
    process.exit(1);
});
