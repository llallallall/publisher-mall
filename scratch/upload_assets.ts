
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envPath = '/Users/devowlscorp/Projects/nuxt/publisher-mall/.env';
dotenv.config({ path: envPath });

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

async function upload() {
    const bucketName = 'digital-assets';
    
    // 1. MP3 업로드
    const mp3File = '/tmp/english-listening-v1.mp3';
    fs.writeFileSync(mp3File, 'fake mp3 data for testing');
    const mp3Buffer = fs.readFileSync(mp3File);
    
    console.log('Uploading MP3...');
    const { error: e1 } = await supabase.storage.from(bucketName).upload('english-listening-v1.mp3', mp3Buffer, {
        contentType: 'audio/mpeg',
        upsert: true
    });
    if (e1) console.error('MP3 upload failed:', e1);
    else console.log('MP3 upload success');

    // 2. PDF 업로드 (수학 번들 대비)
    const pdfFile = '/tmp/math-bundle-kit.pdf';
    fs.writeFileSync(pdfFile, 'fake pdf data for math bundle');
    const pdfBuffer = fs.readFileSync(pdfFile);
    
    console.log('Uploading PDF...');
    const { error: e2 } = await supabase.storage.from(bucketName).upload('math-bundle-kit.pdf', pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
    });
    if (e2) console.error('PDF upload failed:', e2);
    else console.log('PDF upload success');
}

upload();
