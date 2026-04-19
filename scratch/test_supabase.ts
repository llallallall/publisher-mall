
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Root .env
const envPath = '/Users/devowlscorp/Projects/nuxt/publisher-mall/.env';
dotenv.config({ path: envPath });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing variables in ' + envPath);
    console.log('Keys present:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    console.log(`Connecting to ${url}...`);
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
        console.error('Error listing buckets:', bError);
        return;
    }
    console.log('Buckets:', buckets.map(b => b.name));

    const bucketName = 'digital-assets';
    if (!buckets.find(b => b.name === bucketName)) {
        console.log(`Bucket ${bucketName} not found.`);
        return;
    }

    const { data: files, error: fError } = await supabase.storage.from(bucketName).list();
    if (fError) {
        console.error('Error listing files:', fError);
    } else {
        console.log(`Files in ${bucketName}:`, files.map(f => f.name));
    }
}

test();
