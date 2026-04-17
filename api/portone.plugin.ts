import { Controller, Post, Body, Req } from '@nestjs/common';
import {
    PluginCommonModule,
    VendurePlugin,
    OrderService,
    PaymentService,
    RequestContextService,
    EventBus,
} from '@vendure/core';

@Controller('payments')
class PortoneController {
    constructor(
        private orderService: OrderService,
        private paymentService: PaymentService,
        private requestContextService: RequestContextService,
        private eventBus: EventBus,
    ) {}

    /**
     * Portone Webhook Receiver
     * merchant_uid usually maps to Order.code
     */
    @Post('portone-webhook')
    async handleWebhook(@Body() body: any) {
        const { imp_uid, merchant_uid, status } = body;
        console.log(`Received Portone Webhook: ${imp_uid} (${status}) for Order ${merchant_uid}`);

        if (status === 'paid') {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            
            // 1. Find the order by code
            const order = await this.orderService.findOneByCode(ctx, merchant_uid);
            if (!order) {
                console.error(`Order not found: ${merchant_uid}`);
                return { success: false };
            }

            // 2. Find and settle the associated payment
            const payments = await this.orderService.getOrderPayments(ctx, order.id);
            const payment = payments.find(p => p.transactionId === imp_uid || (p.metadata && p.metadata.imp_uid === imp_uid));
            
            if (payment && payment.state !== 'Settled') {
                await this.orderService.settlePayment(ctx, payment.id);
                console.log(`Order ${order.code} successfully settled via webhook.`);
            }

        }
        
        return { success: true };
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [PortoneController],
})
export class PortonePlugin {}
