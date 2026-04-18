import {
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
    LanguageCode,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';

import path from 'path';
import dotenv from 'dotenv';
import { DigitalMaterialPlugin } from './digital-material.plugin';
import { portonePaymentHandler } from './portone.payment-handler';
import { PortonePlugin } from './portone.plugin';

// Load .env from root directory

dotenv.config({ path: path.join(__dirname, '../.env') });

/** * [주의] v3.6.x 환경의 Node16 모드에서는 
 * 일반적인 import가 타입을 찾지 못하는 경우가 많습니다. 
 * 아래와 같이 require를 사용하여 컴파일러를 직접 가져오는 것이 
 * MVP 개발 속도를 높이는 실전 팁입니다.
 */
const { compileUiExtensions } = require('@vendure/ui-devkit/compiler');

export const config: VendureConfig = {
    customFields: {
        ProductVariant: [
            {
                name: 'digitalMaterialUrl',
                type: 'string',
                public: true,
                label: [{ languageCode: LanguageCode.ko, value: '디지털 자료 URL' }]
            },
            {
                name: 'isDigital',
                type: 'boolean',
                public: true,
                defaultValue: false,
                label: [{ languageCode: LanguageCode.ko, value: '디지털 상품 여부' }]
            },
            {
                name: 'productType',
                type: 'string',
                public: true,
                defaultValue: 'PHYSICAL',
                options: [
                    { value: 'PHYSICAL', label: [{ languageCode: LanguageCode.ko, value: '실물 도서' }] },
                    { value: 'DIGITAL', label: [{ languageCode: LanguageCode.ko, value: '디지털 자료' }] },
                    { value: 'BUNDLE', label: [{ languageCode: LanguageCode.ko, value: '번들 상품' }] },
                ],
            },
            {
                name: 'bundleComponentIds',
                type: 'string',
                public: true,
                label: [{ languageCode: LanguageCode.ko, value: '번들 구성품 IDs (JSON)' }]
            },
        ],
    },


    apiOptions: {
        port: 4000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        // For development, we allow all origins. 
        // In production (Vercel), this should be narrowed.
        cors: {
            origin: ['http://localhost:5000'],
            credentials: true,
        },


    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: 'admin',
            password: 'admin',
        },
        cookieOptions: {
            secret: process.env.SUPABASE_SERVICE_ROLE_KEY || 'shhh-secret',
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: true,
        logging: false,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
    },
    paymentOptions: {
        paymentMethodHandlers: [portonePaymentHandler], // Portone handler registered
    },

    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'static/assets'),
            // Default naming and storage strategies are used if not specified
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({}), // Options are required in v3
        EmailPlugin.init({
            route: 'mailbox',
            devMode: true,
            outputPath: path.join(__dirname, 'static/email/test-emails'),
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, 'static/email/templates'),
            globalTemplateVars: {
                fromAddress: 'noreply@publisher-mall.com',
                fromName: 'Publisher Mall',
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: 3003,
            adminUiConfig: {
                defaultLanguage: LanguageCode.ko,
                availableLanguages: [LanguageCode.ko, LanguageCode.en],
            },
            app: compileUiExtensions({
                // 현재 api 폴더 상위의 publisher-mall 루트에 __admin-ui 생성 [cite: 2026-04-18]
                outputPath: path.join(__dirname, '../__admin-ui'),
                extensions: [
                    {
                        translations: {
                            // api 폴더 내 같은 레벨의 ko.json 참조 [cite: 2026-04-18]
                            ko: path.join(__dirname, 'ko.json'),
                        },
                    },
                ],
                devMode: true,
            }),
        }),
        DigitalMaterialPlugin.init(),
        PortonePlugin,
    ],
};


