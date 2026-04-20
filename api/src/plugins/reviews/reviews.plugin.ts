import {
    Entity,
    Column,
    ManyToOne,
} from 'typeorm';
import {
    VendureEntity,
    DeepPartial,
    ID,
    Product,
    PluginCommonModule,
    VendurePlugin,
    Ctx,
    LanguageCode,
} from '@vendure/core';
import { gql } from 'graphql-tag';
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';

@Entity()
export class ProductReview extends VendureEntity {
    constructor(input?: DeepPartial<ProductReview>) {
        super(input);
        if (input) {
            Object.assign(this, input);
        }
    }

    @Column()
    authorName: string;

    @Column({ default: 5 })
    rating: number;

    @Column({ type: 'text' })
    body: string;

    @Column({ default: 'Approved' }) 
    state: string;

    @Column({ nullable: true })
    source: string; 

    @Column({ nullable: true })
    externalId: string; 

    @ManyToOne(type => Product)
    product: Product;
}

const commonSchema = gql`
    type ProductReview {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        authorName: String!
        rating: Int!
        body: String!
        state: String!
        source: String
        externalId: String
        product: Product!
    }

    type ProductReviewList {
        items: [ProductReview!]!
        totalItems: Int!
    }
`;

const shopSchema = gql`
    ${commonSchema}

    extend type Query {
        productReviews(productId: ID!, skip: Int, take: Int): ProductReviewList!
    }

    extend type Product {
        reviews(skip: Int, take: Int): ProductReviewList!
    }

    extend type Mutation {
        addReview(input: CreateReviewInput!): ProductReview!
    }

    input CreateReviewInput {
        productId: ID!
        authorName: String!
        rating: Int!
        body: String!
    }
`;

const adminSchema = gql`
    ${commonSchema}

    extend type Query {
        allProductReviews(skip: Int, take: Int, source: String, state: String): ProductReviewList!
    }

    extend type Mutation {
        approveReview(id: ID!): ProductReview!
        rejectReview(id: ID!): ProductReview!
        updateReviewSource(id: ID!, source: String!): ProductReview!
        importReviews(input: [ImportReviewInput!]!): Int!
    }

    input ImportReviewInput {
        productId: ID!
        authorName: String!
        rating: Int!
        body: String!
        source: String
        externalId: String
        createdAt: DateTime
    }
`;

@Injectable()
export class ReviewService {
    constructor(private connection: TransactionalConnection) {}

    async findByProduct(ctx: RequestContext, productId: ID, skip = 0, take = 10) {
        const [items, totalItems] = await this.connection.getRepository(ctx, ProductReview).findAndCount({
            where: { product: { id: productId }, state: 'Approved' },
            relations: ['product'],
            order: { createdAt: 'DESC' },
            skip,
            take
        });
        return { items, totalItems };
    }

    async findAll(ctx: RequestContext, skip = 0, take = 10, source?: string, state?: string) {
        const where: any = {};
        if (source) where.source = source;
        if (state) where.state = state;

        const [items, totalItems] = await this.connection.getRepository(ctx, ProductReview).findAndCount({
            where,
            relations: ['product'],
            order: { createdAt: 'DESC' },
            skip,
            take
        });
        return { items, totalItems };
    }

    async updateSource(ctx: RequestContext, id: ID, source: string) {
        const review = await this.connection.getEntityOrThrow(ctx, ProductReview, id);
        review.source = source;
        return this.connection.getRepository(ctx, ProductReview).save(review);
    }

    async create(ctx: RequestContext, input: any) {
        const product = await this.connection.getEntityOrThrow(ctx, Product, input.productId);
        const review = new ProductReview({
            ...input,
            product,
            state: 'Pending', 
            source: 'Internal'
        });
        return this.connection.getRepository(ctx, ProductReview).save(review);
    }

    async import(ctx: RequestContext, inputs: any[]) {
        let count = 0;
        for (const input of inputs) {
            const product = await this.connection.getRepository(ctx, Product).findOne({ where: { id: input.productId } });
            if (product) {
                const review = new ProductReview({
                    ...input,
                    product,
                    state: 'Approved' 
                });
                await this.connection.getRepository(ctx, ProductReview).save(review);
                count++;
            }
        }
        return count;
    }

    async setState(ctx: RequestContext, id: ID, state: string) {
        const review = await this.connection.getEntityOrThrow(ctx, ProductReview, id);
        review.state = state;
        return this.connection.getRepository(ctx, ProductReview).save(review);
    }
}

@Resolver('ProductReview')
export class ShopReviewResolver {
    constructor(private reviewService: ReviewService) {}

    @Query()
    productReviews(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.reviewService.findByProduct(ctx, args.productId, args.skip, args.take);
    }

    @Mutation()
    addReview(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.reviewService.create(ctx, args.input);
    }
}

@Resolver('Product')
export class ProductReviewResolver {
    constructor(private reviewService: ReviewService) {}

    @ResolveField()
    reviews(@Ctx() ctx: RequestContext, @Parent() product: Product, @Args() args: any) {
        return this.reviewService.findByProduct(ctx, product.id, args.skip ?? 0, args.take ?? 10);
    }
}

@Resolver()
export class AdminReviewResolver {
    constructor(private reviewService: ReviewService) {}

    @Query()
    allProductReviews(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.reviewService.findAll(ctx, args.skip, args.take, args.source, args.state);
    }

    @Mutation()
    approveReview(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.reviewService.setState(ctx, args.id, 'Approved');
    }

    @Mutation()
    rejectReview(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.reviewService.setState(ctx, args.id, 'Rejected');
    }

    @Mutation()
    updateReviewSource(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.reviewService.updateSource(ctx, args.id, args.source);
    }

    @Mutation()
    importReviews(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.reviewService.import(ctx, args.input);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [ProductReview],
    providers: [ReviewService],
    configuration: config => {
        // 엔티티에 직접 컬럼(externalId, source)이 정의되어 있으므로 
        // 별도의 customFields 등록 없이 즉시 사용 가능합니다.
        return config;
    },
    shopApiExtensions: {
        schema: shopSchema,
        resolvers: [ShopReviewResolver, ProductReviewResolver],
    },
    adminApiExtensions: {
        schema: adminSchema,
        resolvers: [AdminReviewResolver],
    },
})
export class SeodamReviewsPlugin {}
