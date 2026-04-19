
import { 
    VendurePlugin, 
    EventBus, 
    OrderStateTransitionEvent, 
    PluginCommonModule, 
    TransactionalConnection,
    Order,
    RequestContext
} from '@vendure/core';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [],
})
export class NotificationPlugin {
    constructor(private eventBus: EventBus, private connection: TransactionalConnection) {
        this.eventBus.ofType(OrderStateTransitionEvent).subscribe(async (event) => {
            if (event.toState === 'PaymentSettled') {
                await this.sendNotifications(event.ctx, event.order.id);
            }
        });
    }

    private async sendNotifications(ctx: RequestContext, orderId: any) {
        const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            relations: ['customer', 'lines', 'lines.productVariant'],
        });

        const customer = order.customer;
        if (!customer) return;

        console.log(`\n🔔 [NOTIFICATION] ========================================`);
        console.log(`📧 Sending Confirmation Email to: ${customer.emailAddress}`);
        console.log(`💬 Sending Kakao Alimtalk to: ${customer.phoneNumber || '010-XXXX-XXXX'}`);
        console.log(`📦 Order #${order.code} - ${order.lines.length} items settled.`);
        
        const digitalItems = order.lines.filter(l => (l.productVariant.customFields as any).productType !== 'PHYSICAL');
        if (digitalItems.length > 0) {
            console.log(`✨ Special notification: ${digitalItems.length} digital assets are now available in your Archive.`);
        }
        console.log(`===========================================================\n`);
    }
}
