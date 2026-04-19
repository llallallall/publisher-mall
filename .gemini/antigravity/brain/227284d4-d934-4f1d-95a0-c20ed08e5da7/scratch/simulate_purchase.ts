
const { bootstrap, RequestContext, CustomerService, ProductVariantService } = require("@vendure/core");
const { config } = require("./api/vendure-config");

async function main() {
    console.log("Bootstrapping...");
    const app = await bootstrap(config);
    const conn = app.get(require("typeorm").Connection);
    
    // 1. Find Customer
    const customer = await app.get(CustomerService).findOneByEmailAddress(RequestContext.empty(), "test@devowls.io");
    if (!customer) {
        console.log("Customer test@devowls.io not found!");
        await app.close();
        return;
    }
    console.log("Found Customer ID:", customer.id);

    // 2. Find a digital variant
    const variants = await conn.query("SELECT id, sku FROM product_variant WHERE \"customFieldsDigitalmaterial\" IS NOT NULL LIMIT 1");
    if (variants.length === 0) {
        console.log("No digital variants found.");
        await app.close();
        return;
    }
    const variantId = variants[0].id;
    console.log("Activating for variant:", variants[0].sku, "(ID:", variantId, ")");

    // 3. Clear and Insert directly
    await conn.query("DELETE FROM digital_material_activation WHERE customerId = $1", [customer.id]);
    
    const activationDate = new Date();
    // Simulate a signed URL or just the path
    const downloadUrl = "https://tafnisicdywxbmwlyumd.supabase.co/storage/v1/object/sign/public/digital-assets/samples/math-2026.pdf?token=dummy";
    
    await conn.query(`
        INSERT INTO digital_material_activation ("activationDate", "downloadUrl", "customerId", "productVariantId")
        VALUES ($1, $2, $3, $4)
    `, [activationDate, downloadUrl, customer.id, variantId]);

    console.log("Manual Activation SUCCESS.");
    await app.close();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
