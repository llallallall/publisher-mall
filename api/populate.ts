import { bootstrap, ProductService, ProductVariantService, RequestContextService, LanguageCode, ChannelService, ID } from '@vendure/core';
import { config } from './vendure-config';
import { LibraryService } from './library.plugin';
import { ReviewService } from './review.plugin';

async function runPopulate() {
    const app = await bootstrap(config);
    const productService = app.get(ProductService);
    const variantService = app.get(ProductVariantService);
    const ctxService = app.get(RequestContextService);
    const channelService = app.get(ChannelService);
    const libraryService = app.get(LibraryService);
    const reviewService = app.get(ReviewService);

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

    const createdVariants: Record<string, ID> = {};

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

            // Determine metadata
            const isDigital = p.slug.includes('mp3') || p.slug === 'korean-pdf';
            const isBundle = p.slug.includes('bundle');
            const productType = isBundle ? 'BUNDLE' : (isDigital ? 'DIGITAL' : 'PHYSICAL');
            
            const digitalUrl = p.slug.includes('mp3') ? '/assets/english-listening-v1.mp3' : 
                               p.slug === 'korean-pdf' ? '/assets/korean-mock-1.pdf' : undefined;

            const variants = await variantService.create(ctx, [{
                productId: product.id,
                sku: p.slug.toUpperCase(),
                price: p.price,
                translations: [{ languageCode: LanguageCode.ko, name: 'Standard' }],
                stockOnHand: 100,
                trackInventory: true as any, 
                customFields: {
                    isDigital: isDigital,
                    digitalMaterialUrl: digitalUrl,
                    productType: productType,
                }
            }] as any);

            const vId = (variants[0] as any).id;
            createdVariants[p.slug] = vId;

            console.log(`Created product: ${p.name} (Type: ${productType}, ID: ${vId})`);
        } catch (e: any) {
            console.log(`Skipping or failed to create ${p.name}: ${e.message}`);
        }
    }

    // Post-process: Link bundle components
    console.log('--- Linking Bundle Components ---');
    if (createdVariants['2026-math-bundle']) {
        // Mock components: Real physical book + digital PDF (we use some IDs from created list)
        const componentIds = [
            createdVariants['2026-korean-mock-1'], // Using this as physical component mock
            createdVariants['english-listening-mp3'], // Using this as digital component mock
        ].filter(Boolean);

        await variantService.update(ctx, [{
            id: createdVariants['2026-math-bundle'],
            customFields: {
                bundleComponentIds: JSON.stringify(componentIds),
            }
        }] as any);
        console.log(`Linked math bundle to components: ${componentIds.join(', ')}`);
    }

    // 1. Populate Library Materials
    console.log('--- Populating Library ---');
    const libraryItems = [
        {
            title: '2026학년도 6월 모의평가 등급컷 (예상)',
            description: 'Lucid Archive 연구소에서 분석한 6월 모의평가 영역별 예상 등급컷 자료입니다. 가입 후 확인 가능합니다.',
            fileUrl: '/assets/grading-6-mock.pdf',
            requireLogin: true,
            isPublic: true
        },
        {
            title: '모의고사 학습 가이드: 상위 1%의 비결',
            description: '효율적인 오답 노트 작성법과 시험 시간 관리 전략이 담긴 무료 가이드입니다.',
            fileUrl: '/assets/study-guide.pdf',
            requireLogin: false,
            isPublic: true
        }
    ];
    for (const item of libraryItems) {
        await libraryService.create(ctx, item);
        console.log(`Created library item: ${item.title}`);
    }

    // 2. Populate Reviews (Imported)
    console.log('--- Importing Reviews ---');
    const mathBundleId = createdVariants['2026-math-bundle'];
    if (mathBundleId) {
        // Need to get the actual Product ID from the Variant
        const variant = await variantService.findOne(ctx, mathBundleId, ['product']);
        const productId = (variant as any).product.id;

        await reviewService.import(ctx, [
            {
                productId,
                authorName: '박지용',
                rating: 5,
                body: '교보문고에서 사고 정답지만 여기서 받으려다 아예 갈아탔습니다. 구성이 알차네요.',
                source: 'Kyobo'
            },
            {
                productId,
                authorName: 'Lucid-Master',
                rating: 5,
                body: '국내 최고 수준의 퀄리티입니다. 해설지가 정말 꼼꼼해서 학원 안 가도 될 수준이에요.',
                source: 'External'
            }
        ]);
        console.log(`Imported reviews for product: ${productId}`);
    }


    console.log('--- Custom Population Finished ---');
    await app.close();
    process.exit(0);
}

runPopulate().catch(err => {
    console.error(err);
    process.exit(1);
});
