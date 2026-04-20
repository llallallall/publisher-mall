import {
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
    LanguageCode,
    CurrencyCode,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';
import 'dotenv/config';

import { SupabaseAuthStrategy } from './supabase-auth-strategy';
import { DigitalMaterialPlugin } from './digital-material.plugin';
import { LibraryPlugin } from './library.plugin';
import { SeodamReviewsPlugin } from './src/plugins/reviews/reviews.plugin';
import { NotificationPlugin } from './notification.plugin';
import { MarketingPlugin } from './marketing.plugin';
import { PortonePlugin } from './portone.plugin';
import { portonePaymentHandler } from './portone.payment-handler';

export const config: VendureConfig = {
    apiOptions: {
        port: +(process.env.PORT || 4000),
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        cors: {
            origin: ['http://localhost:3001', 'http://localhost:4000', 'http://localhost:4200'],
            credentials: true,
        },
        adminApiPlayground: {
            settings: { 'request.credentials': 'include' } as any,
        },
        adminApiDebug: true,
        shopApiPlayground: {
            settings: { 'request.credentials': 'include' } as any,
        },
        shopApiDebug: true,
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.VENDURE_SUPERADMIN_IDENTIFIER || 'superadmin',
            password: process.env.VENDURE_SUPERADMIN_PASSWORD || 'superadmin',
        },
        shopAuthenticationStrategy: [new SupabaseAuthStrategy()],
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: true,
        logging: false,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [portonePaymentHandler],
    },
    customFields: {
        Product: [
            {
                name: 'productType', type: 'string', defaultValue: 'DIGITAL', options: [
                    { value: 'DIGITAL' },
                    { value: 'PHYSICAL' },
                    { value: 'SERVICE' },
                    { value: 'BUNDLE' }
                ]
            },
            {
                name: 'targetGrade', type: 'string', defaultValue: '고3/N수', options: [
                    { value: '고3/N수' },
                    { value: '고2' },
                    { value: '고1' },
                    { value: '공통' }
                ]
            },
            {
                name: 'materialType', type: 'string', defaultValue: '문서', options: [
                    { value: '문서' },
                    { value: '음성' },
                    { value: '영상' },
                    { value: '일반' }
                ]
            },
        ],
        ProductVariant: [
            { name: 'fileUrl', type: 'string', public: false },
            { name: 'digitalMaterialUrl', type: 'string', public: true },
            {
                name: 'productType', type: 'string', defaultValue: 'DIGITAL', options: [
                    { value: 'DIGITAL' },
                    { value: 'PHYSICAL' },
                    { value: 'SERVICE' },
                    { value: 'BUNDLE' }
                ]
            },
            { name: 'bundleComponentIds', type: 'string', public: true },
        ],
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'static/assets'),
            assetUrlPrefix: `${process.env.VENDURE_URL || 'http://localhost:4000'}/assets/`,
        }),
        DefaultJobQueuePlugin.init({}),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, 'static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, 'static/email/templates'),
            globalTemplateVars: {
                fromAddress: 'noreply@publisher-mall.com',
                contactUrl: 'http://localhost:3001/contact',
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: +(process.env.ADMIN_PORT || 3003),
            app: compileUiExtensions({
                outputPath: path.join(__dirname, '../__admin-ui'),
                extensions: [
                    SeodamReviewsPlugin.uiExtensions,
                    {
                        // 전역 및 익스텐션 한글화를 위한 번역 파일 바인딩
                        translations: {
                            ko: path.join(__dirname, 'ko.json'),
                        },
                    },
                ],
                devMode: true,
            }),
            adminUiConfig: {
                defaultLanguage: LanguageCode.ko,
                availableLanguages: [LanguageCode.ko, LanguageCode.en],
                brand: '서담 - 관리자',
                hideVendureBranding: true,
            },
        }),
        DigitalMaterialPlugin.init(),
        LibraryPlugin,
        SeodamReviewsPlugin,
        NotificationPlugin,
        MarketingPlugin,
        PortonePlugin,
    ],
};
