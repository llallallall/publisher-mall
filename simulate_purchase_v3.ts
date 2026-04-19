
const { bootstrap, RequestContext, CustomerService, ChannelService } = require("@vendure/core");
const { config } = require("./api/vendure-config");

async function main() {
    console.log("Bootstrapping...");
    const app = await bootstrap(config);
    const conn = app.get(require("typeorm").Connection);
    const ctx = RequestContext.empty();
    
    // 1. Ensure Customer exists
    let customer = await app.get(CustomerService).findOneByEmailAddress(ctx, "test@devowls.io");
    if (!customer) {
        console.log("Customer test@devowls.io not found. Registering...");
        // Manual insertion since CustomerService.create requires a lot of setup (address, etc)
        // Or simpler: use SQL
        await conn.query(`
            INSERT INTO public.customer ("firstName", "lastName", "emailAddress", "phoneNumber")
            VALUES ($1, $2, $3, $4)
        `, ["Test", "User", "test@devowls.io", "010-0000-0000"]);
        
        customer = await app.get(CustomerService).findOneByEmailAddress(ctx, "test@devowls.io");
        
        // Link to user account
        const hashedPassword = await require("bcryptjs").hash("test1234", 10);
        await conn.query(`
            INSERT INTO public.user ("identifier", "passwordHash", "verified")
            VALUES ($1, $2, $3)
        `, ["test@devowls.io", hashedPassword, true]);
        
        const user = await conn.query("SELECT id FROM public.user WHERE identifier = $1", ["test@devowls.io"]);
        await conn.query(`UPDATE public.customer SET "userId" = $1 WHERE id = $2`, [user[0].id, customer.id]);
    }
    
    const customerId = customer.id;
    console.log("Active Customer ID:", customerId);

    // 2. Find a digital variant
    const variants = await conn.query('SELECT id, sku FROM public.product_variant WHERE "customFieldsDigitalmaterial" IS NOT NULL LIMIT 1');
    if (variants.length === 0) {
        console.log("No digital variants found.");
        await app.close();
        return;
    }
    const variantId = variants[0].id;
    console.log("Activating for variant:", variants[0].sku);

    // 3. Clear and Insert
    await conn.query('DELETE FROM public.digital_material_activation WHERE "customerId" = $1', [customerId]);
    
    const activationDate = new Date();
    const downloadUrl = "https://tafnisicdywxbmwlyumd.supabase.co/storage/v1/object/sign/public/digital-assets/samples/math-2026.pdf?token=dummy";
    
    await conn.query(`
        INSERT INTO public.digital_material_activation ("activationDate", "downloadUrl", "customerId", "productVariantId")
        VALUES ($1, $2, $3, $4)
    `, [activationDate, downloadUrl, customerId, variantId]);

    console.log("SUCCESS: test@devowls.io has material now.");
    await app.close();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
