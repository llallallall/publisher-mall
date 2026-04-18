import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function run() {
    await client.connect();
    
    console.log('Checking DigitalActivation table...');
    try {
        const res = await client.query('SELECT * FROM "digital_activation"');
        console.log(`Found ${res.rowCount} activations:`);
        for (const row of res.rows) {
            console.log(`- ID: ${row.id}, Customer: ${row.customerId}, Variant: ${row.productVariantId}`);
        }
    } catch (e: any) {
        console.error('Error querying digital_activation:', e.message);
    }
    
    await client.end();
}

run();
