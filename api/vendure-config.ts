import {
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import path from 'path';
import dotenv from 'dotenv';

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config: VendureConfig = {
    apiOptions: {
        port: 3002,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        // For development, we allow all origins. 
        // In production (Vercel), this should be narrowed.
        cors: true,
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
        paymentMethodHandlers: [], // Portone handler will be added here
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
    ],
};
