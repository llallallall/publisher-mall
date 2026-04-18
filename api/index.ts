import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

// For MVP, we run migrations automatically on bootstrap if synchronize is not enough,
// but Vendure handles synchronize: true via TypeORM.
// We keep runMigrations available for structured schema changes.

bootstrap(config)
    .then(() => {
        console.log(`Vendure server started successfully at http://localhost:${config.apiOptions.port}/admin-api`);
    })
    .catch(err => {
        console.error('Error starting Vendure server:', err);
        process.exit(1);
    });
