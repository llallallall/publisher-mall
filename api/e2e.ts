import fetch from 'node-fetch';

const SHOP_API = 'http://localhost:4000/shop-api';
const WEBHOOK_API = 'http://localhost:4000/payments/portone-webhook';

let authToken = '';

async function queryShop(query: string, variables: any = {}) {
    const headers: any = {
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(SHOP_API, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    
    if (response.headers.has('vendure-auth-token')) {
        authToken = response.headers.get('vendure-auth-token') as string;
    }
    
    if (json.errors) {
        console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
        throw new Error('GraphQL query failed');
    }

    return json.data;
}

async function run() {
    console.log('1. Registering user...');
    await queryShop(`
        mutation Register($input: RegisterCustomerInput!) {
            registerCustomerAccount(input: $input) {
                ... on Success { success }
                ... on ErrorResult { errorCode message }
            }
        }
    `, {
        input: {
            emailAddress: `test-${Date.now()}@example.com`,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        }
    });

    // In a real app, registration might require verification. 
    // Vendure defaults require verification. We might need to bypass or use a different approach if verification is required.
    // Let's try to login anyway. If it fails, we'll see.
    console.log('2. Logging in...');
    const loginRes = await queryShop(`
        mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
                ... on CurrentUser { id identifier }
                ... on ErrorResult { errorCode message }
            }
        }
    `, {
        username: `test@example.com`, // We'll try the previous one, or if it needs verification, we have a problem.
        password: 'password123'
    });
    
    if (loginRes.login.errorCode) {
        console.warn('Login failed:', loginRes.login.message);
    } else {
        console.log('Logged in as:', loginRes.login.identifier);
    }

    console.log('3. Fetching products...');
    const productsRes = await queryShop(`
        query {
            products(options: { take: 10 }) {
                items {
                    id
                    name
                    variants { id price }
                }
            }
        }
    `);
    
    const digitalProduct = productsRes.products.items.find((p: any) => p.name.includes('디지털') || p.name.includes('MP3'));
    const variantId = digitalProduct ? digitalProduct.variants[0].id : productsRes.products.items[0].variants[0].id;
    console.log(`Using variant ID: ${variantId}`);

    console.log('4. Adding item to order...');
    const addRes = await queryShop(`
        mutation AddItem($variantId: ID!) {
            addItemToOrder(productVariantId: $variantId, quantity: 1) {
                ... on Order { id code state totalQuantity }
                ... on ErrorResult { errorCode message }
            }
        }
    `, { variantId });

    const orderCode = addRes.addItemToOrder.code;
    console.log(`Order Code: ${orderCode}`);

    console.log('5. Setting customer...');
    await queryShop(`
        mutation {
            setCustomerForOrder(input: {
                emailAddress: "guest@example.com",
                firstName: "Guest",
                lastName: "User"
            }) {
                ... on Order { id }
                ... on ErrorResult { message }
            }
        }
    `);

    console.log('6. Setting shipping address...');
    await queryShop(`
        mutation {
            setOrderShippingAddress(input: {
                streetLine1: "123 Test St",
                countryCode: "KR"
            }) {
                ... on Order { id }
                ... on ErrorResult { message }
            }
        }
    `);

    console.log('7. Fetching shipping methods and setting one...');
    const shippingMethodsRes = await queryShop(`
        query {
            eligibleShippingMethods { id name }
        }
    `);
    const shippingMethodId = shippingMethodsRes.eligibleShippingMethods[0].id;
    
    await queryShop(`
        mutation SetShippingMethod($id: [ID!]!) {
            setOrderShippingMethod(shippingMethodId: $id) {
                ... on Order { id }
                ... on ErrorResult { message }
            }
        }
    `, { id: [shippingMethodId] });

    console.log('8. Transitioning to ArrangingPayment...');
    const transitionRes = await queryShop(`
        mutation {
            transitionOrderToState(state: "ArrangingPayment") {
                ... on Order { id state }
                ... on ErrorResult { message }
            }
        }
    `);
    console.log(`Order state: ${transitionRes.transitionOrderToState.state}`);

    console.log('9. Adding Payment...');
    const paymentRes = await queryShop(`
        mutation {
            addPaymentToOrder(input: {
                method: "portone-payment",
                metadata: { imp_uid: "imp_mock_99999" }
            }) {
                ... on Order { id state }
                ... on ErrorResult { errorCode message }
            }
        }
    `);
    console.log(`Payment added. Order state: ${paymentRes.addPaymentToOrder.state}`);

    console.log('10. Triggering Webhook...');
    const webhookRes = await fetch(WEBHOOK_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imp_uid: "imp_mock_99999",
            merchant_uid: orderCode,
            status: "paid"
        })
    });
    const webhookJson = await webhookRes.json();
    console.log('Webhook response:', webhookJson);

    console.log('11. Checking Digital Materials...');
    // If we used a guest customer, we might not be able to query myDigitalMaterials.
    // Let's query the active order to see if it's settled.
    const activeOrderRes = await queryShop(`
        query {
            activeOrder {
                id code state
            }
        }
    `);
    console.log('Final Order State:', activeOrderRes.activeOrder?.state);

}

run().catch(console.error);
