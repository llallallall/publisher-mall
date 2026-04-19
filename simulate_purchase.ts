
import { bootstrap, RequestContext } from "@vendure/core";
import { config } from "./api/vendure-config";

async function main() {
    console.log("Bootstrapping...");
    const app = await bootstrap(config);
    const conn = app.get(require("typeorm").Connection);
    
    // 1. Find Customer by Email
    const customers = await conn.query('SELECT id FROM public.customer WHERE "emailAddress" = $1', ["test@devowls.io"]);
    if (customers.length === 0) {
        console.log("Customer test@devowls.io not found!");
        await app.close();
        return;
    }
    const customerId = customers[0].id;
    console.log("Found Customer ID:", customerId);

    // 2. Find a digital variant
    const variants = await conn.query("SELECT id, sku FROM public.product_variant WHERE \"customFieldsDigitalmaterial\" IS NOT NULL LIMIT 1");
    if (variants.length === 0) {
        console.log("No digital variants found.");
        await app.close();
        return;
    }
    const variantId = variants[0].id;
    console.log("Activating for variant:", variants[0].sku, "(ID:", variantId, ")");

    // 3. Clear and Insert directly
    await conn.query("DELETE FROM public.digital_material_activation WHERE \"customerId\" = $1", [customerId]);
    
    const activationDate = new Date();
    const downloadUrl = "https://tafnisicdywxbmwlyumd.supabase.co/storage/v1/object/sign/public/digital-assets/samples/math-2026.pdf?token=dummy";
    
    await conn.query(`
        INSERT INTO public.digital_material_activation ("activationDate", "downloadUrl", "customerId", "productVariantId")
        VALUES ($1, $2, $3, $4)
    `, [activationDate, downloadUrl, customerId, variantId]);

    console.log("Manual Activation SUCCESS for test@devowls.io");
    await app.close();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
