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
    Ctx,
    ProductVariantService,
} from '@vendure/core';

import { gql } from 'graphql-tag';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';
import { In } from 'typeorm';

let _supabase: SupabaseClient | undefined;
function getSupabase() {
    if (!_supabase && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }
    return _supabase;
}

@Entity()
export class DigitalActivation extends VendureEntity {
    constructor(input?: DeepPartial<DigitalActivation>) {
        super(input);
        if (input) {
            Object.assign(this, input);
        }
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
        downloadUrl: String
    }

    type BundleInfo {
        regularPrice: Int!
        savings: Int!
        discountPercent: Int!
    }

    extend type Query {
        myDigitalMaterials: [DigitalActivation!]!
    }

    extend type ProductVariant {
        bundleInfo: BundleInfo
    }
`;



@Injectable()
@Resolver()
export class DigitalMaterialResolver {
    constructor(private connection: TransactionalConnection) {}

    @Query()
    async myDigitalMaterials(@Ctx() ctx: RequestContext) {
        if (!ctx || !ctx.activeUserId) {
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

@Resolver('DigitalActivation')
export class DigitalActivationEntityResolver {
    @ResolveField()
    async downloadUrl(@Ctx() ctx: RequestContext, @Parent() activation: any) {
        // Hydrate productVariant if missing (e.g. from relations)
        const variant = activation.productVariant;
        if (!variant || !variant.customFields) return null;

        const url = variant.customFields.digitalMaterialUrl;
        if (!url) return null;

        // If it's a Supabase path (not a full URL), generate signed URL
        const supabase = getSupabase();
        if (!url.startsWith('http') && supabase) {
            const bucket = process.env.SUPABASE_BUCKET || 'digital-assets';
            const { data, error } = await supabase.storage
                .from(bucket)
                .createSignedUrl(url, 3600); // 1 hour validity

            if (error) {
                console.error(`Error generating signed URL for ${url}:`, error);
                return null;
            }
            return data.signedUrl;
        }

        return url;
    }
}

@Resolver('ProductVariant')
export class BundleVariantResolver {
    constructor(
        private connection: TransactionalConnection,
        private productVariantService: ProductVariantService
    ) {}

    @ResolveField()
    async bundleInfo(@Ctx() ctx: RequestContext, @Parent() variant: any) {
        // Ensure customFields are present
        let fullVariant = variant;
        if (!variant.customFields || !variant.customFields.productType) {
            fullVariant = await this.connection.getEntityOrThrow(ctx, ProductVariant, variant.id);
        }

        if (!fullVariant || fullVariant.customFields?.productType !== 'BUNDLE') {
            return null;
        }

        if (!fullVariant.customFields.bundleComponentIds) return null;

        try {
            const rawIds: any[] = JSON.parse(fullVariant.customFields.bundleComponentIds);
            const componentIds = rawIds.map(id => id.toString());
            
            const components = await this.productVariantService.findByIds(ctx, componentIds);

            if (components.length === 0) return null;

            const regularPrice = components.reduce((sum, v) => sum + v.price, 0);
            const savings = Math.max(0, regularPrice - fullVariant.price);
            const discountPercent = regularPrice > 0 ? Math.round((savings / regularPrice) * 100) : 0;

            return {
                regularPrice,
                savings,
                discountPercent
            };
        } catch (e: any) {
            console.log(`DEBUG: Error in bundleInfo: ${e.message}`);
            return null;
        }
    }
}


@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [DigitalActivation],
    shopApiExtensions: {
        schema: shopSchema,
        resolvers: [DigitalMaterialResolver, DigitalActivationEntityResolver, BundleVariantResolver],
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
        console.log('DigitalMaterialPlugin initialized and subscribing to events');
        this.eventBus.ofType(OrderStateTransitionEvent).subscribe(async event => {
            if (event.toState === 'PaymentSettled') {
                await this.activateMaterials(event.ctx, event.order.id);
            }
        });

    }

    private async activateMaterials(ctx: RequestContext, orderId: ID) {
        console.log(`activateMaterials called for Order ${orderId}`);
        const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            relations: ['customer', 'lines', 'lines.productVariant'],
        } as any);

        if (!order.customer) {
            console.log(`Order ${orderId} has no customer. skipping.`);
            return;
        }

        console.log(`Order ${orderId} has ${(order as any).lines?.length || 0} lines.`);
        for (const line of (order as any).lines) {
            // Re-fetch the variant to ensure customFields are fully loaded [BUG FIX]
            const fullVariant = await this.connection.getRepository(ctx, ProductVariant).findOne({
                where: { id: line.productVariant.id },
            });
            if (fullVariant) {
                await this.activateVariant(ctx, order.customer, fullVariant);
            }
        }
    }

    private async activateVariant(ctx: RequestContext, customer: Customer, variant: ProductVariant) {
        console.log(`Checking activation for variant ${variant.id} (${variant.sku})`);
        console.log(`Raw variant object:`, JSON.stringify(variant));
        const customFields = (variant as any).customFields;
        console.log(`Custom Fields:`, JSON.stringify(customFields));
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
                    // Also re-fetch here to be safe and consistent [BUG FIX]
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

