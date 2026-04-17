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
        }),
        DigitalMaterialPlugin.init(),
        PortonePlugin,
    ],
};


