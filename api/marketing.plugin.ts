import {
    PluginCommonModule,
    VendurePlugin,
    Ctx,
    RequestContext,
    LanguageCode,
    CustomerService,
} from '@vendure/core';
import { gql } from 'graphql-tag';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';

const adminSchema = gql`
    extend type Mutation {
        broadcastEmail(subject: String!, content: String!): Int!
    }
`;

@Injectable()
export class MarketingService {
    constructor(
        private customerService: CustomerService,
    ) {}

    async broadcast(ctx: RequestContext, subject: string, content: string) {
        const customers = await this.customerService.findAll(ctx, {
            filter: {
                emailAddress: {
                    contains: '@',
                },
            },
        });

        let count = 0;
        for (const customer of customers.items) {
            // We'll use a generic template or a custom one if defined
            // For now, we'll use the 'email-verification' helper or direct send if available
            // In a real scenario, we'd add a custom email handler to EmailPlugin
            console.log(`Sending marketing email to ${customer.emailAddress}: ${subject}`);
            count++;
        }
        return count;
    }
}

@Resolver()
export class MarketingResolver {
    constructor(private marketingService: MarketingService) {}

    @Mutation()
    async broadcastEmail(@Ctx() ctx: RequestContext, @Args() args: { subject: string; content: string }) {
        return this.marketingService.broadcast(ctx, args.subject, args.content);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [MarketingService],
    adminApiExtensions: {
        schema: adminSchema,
        resolvers: [MarketingResolver],
    },
})
export class MarketingPlugin {}
