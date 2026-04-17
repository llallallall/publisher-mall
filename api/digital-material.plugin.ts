import {
    Entity,
    Column,
    ManyToOne,
} from 'typeorm';
import {
    VendureEntity,
    DeepPartial,
    ID,
    Customer,
    ProductVariant,
    Order,
    PluginCommonModule,
    VendurePlugin,
    EventBus,
    OrderStateTransitionEvent,
    RequestContext,
    TransactionalConnection,
    LanguageCode,
} from '@vendure/core';

import { gql } from 'graphql-tag';

@Entity()
export class DigitalActivation extends VendureEntity {
    constructor(input?: DeepPartial<DigitalActivation>) {
        super(input);
    }

    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column()
    activationDate: Date;
}

const shopSchema = gql`
    type DigitalActivation implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        customer: Customer!
        productVariant: ProductVariant!
        activationDate: DateTime!
    }

    extend type Query {
        myDigitalMaterials: [DigitalActivation!]!
    }
`;

import { Resolver, Query as GqlQuery } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
@Resolver()
export class DigitalMaterialResolver {
    constructor(private connection: TransactionalConnection) {}

    @GqlQuery()
    async myDigitalMaterials(ctx: RequestContext) {
        if (!ctx.activeUserId) {
            return [];
        }
        
        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { user: { id: ctx.activeUserId as any } },
        });

        if (!customer) {
            return [];
        }

        return this.connection.getRepository(ctx, DigitalActivation).find({
            where: { customer: { id: customer.id } },
            relations: ['productVariant', 'productVariant.product'],
        });
    }
}


@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [DigitalActivation],
    shopApiExtensions: {
        schema: shopSchema,
        resolvers: [DigitalMaterialResolver],
    },
    configuration: config => {


        return config;
    },
})
export class DigitalMaterialPlugin {
    static init() {
        return DigitalMaterialPlugin;
    }

    constructor(private eventBus: EventBus, private connection: TransactionalConnection) {
        this.eventBus.ofType(OrderStateTransitionEvent).subscribe(async event => {
            if (event.toState === 'PaymentSettled') {
                await this.activateMaterials(event.ctx, event.order.id);
            }
        });

    }

    private async activateMaterials(ctx: RequestContext, orderId: ID) {
        const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            relations: ['customer', 'lines', 'lines.productVariant'],
        } as any);

        if (!order.customer) {
            return;
        }

        for (const line of (order as any).lines) {
            await this.activateVariant(ctx, order.customer, line.productVariant);
        }
    }

    private async activateVariant(ctx: RequestContext, customer: Customer, variant: ProductVariant) {
        const customFields = (variant as any).customFields;
        if (!customFields) return;

        // 1. Direct Activation (Digital/Course)
        if (customFields.digitalMaterialUrl) {
            await this.ensureActivated(ctx, customer, variant);
        }

        // 2. Bundle Activation (Recursive)
        if (customFields.productType === 'BUNDLE' && customFields.bundleComponentIds) {
            try {
                const componentIds: ID[] = JSON.parse(customFields.bundleComponentIds);
                for (const componentId of componentIds) {
                    const component = await this.connection.getRepository(ctx, ProductVariant).findOne({
                        where: { id: componentId },
                    });
                    if (component) {
                        await this.activateVariant(ctx, customer, component);
                    }
                }
            } catch (e) {
                console.error('Failed to parse bundle components', e);
            }
        }
    }

    private async ensureActivated(ctx: RequestContext, customer: Customer, variant: ProductVariant) {
        const existing = await this.connection.getRepository(ctx, DigitalActivation).findOne({
            where: {
                customer: { id: customer.id },
                productVariant: { id: variant.id },
            },
        });

        if (!existing) {
            await this.connection.getRepository(ctx, DigitalActivation).save(
                new DigitalActivation({
                    customer: customer,
                    productVariant: variant,
                    activationDate: new Date(),
                }),
            );
            console.log(`Activated material for customer ${customer.emailAddress}: ${variant.sku}`);
        }
    }
}

