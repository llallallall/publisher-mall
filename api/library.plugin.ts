import {
    Entity,
    Column,
} from 'typeorm';
import {
    VendureEntity,
    DeepPartial,
    ID,
    PluginCommonModule,
    VendurePlugin,
    Ctx,
} from '@vendure/core';
import { gql } from 'graphql-tag';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';

@Entity()
export class LibraryMaterial extends VendureEntity {
    constructor(input?: DeepPartial<LibraryMaterial>) {
        super(input);
        if (input) {
            Object.assign(this, input);
        }
    }

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    fileUrl: string;

    @Column({ default: true })
    isPublic: boolean;

    @Column({ default: false })
    requireLogin: boolean;

    @Column({ default: 'GUIDE' }) // ANSWER, ANALYSIS, GUIDE
    category: string;

    @Column({ default: 0 })
    downloadCount: number;
}

@Entity()
export class LibraryDownload extends VendureEntity {
    constructor(input?: DeepPartial<LibraryDownload>) {
        super(input);
        if (input) {
            Object.assign(this, input);
        }
    }

    @Column({ type: 'int' })
    materialId: ID;

    @Column({ type: 'int' })
    customerId: ID;
}

const commonSchema = gql`
    type LibraryMaterial {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        title: String!
        description: String
        fileUrl: String!
        isPublic: Boolean!
        requireLogin: Boolean!
        category: String!
    }

    type LibraryMaterialList {
        items: [LibraryMaterial!]!
        totalItems: Int!
    }

    type LibraryDownload {
        id: ID!
        createdAt: DateTime!
        material: LibraryMaterial!
    }

    input LibraryListOptions {
        skip: Int
        take: Int
    }
`;

const shopSchema = gql`
    ${commonSchema}

    extend type Query {
        libraryMaterials(options: LibraryListOptions): LibraryMaterialList!
        libraryMaterial(id: ID!): LibraryMaterial
        myLibraryDownloads: [LibraryDownload!]!
    }

    extend type Mutation {
        trackDownload(id: ID!): LibraryMaterial!
    }
`;

const adminSchema = gql`
    ${commonSchema}

    extend type Query {
        allLibraryMaterials(options: LibraryListOptions): LibraryMaterialList!
    }

    extend type Mutation {
        createLibraryMaterial(input: CreateLibraryMaterialInput!): LibraryMaterial!
        updateLibraryMaterial(input: UpdateLibraryMaterialInput!): LibraryMaterial!
        deleteLibraryMaterial(id: ID!): Boolean!
    }


    input CreateLibraryMaterialInput {
        title: String!
        description: String
        fileUrl: String!
        isPublic: Boolean
        requireLogin: Boolean
        category: String
    }

    input UpdateLibraryMaterialInput {
        id: ID!
        title: String
        description: String
        fileUrl: String
        isPublic: Boolean
        requireLogin: Boolean
        category: String
    }
`;

@Injectable()
export class LibraryService {
    constructor(private connection: TransactionalConnection) {}

    async findAll(ctx: RequestContext, options: any, admin = false) {
        const skip = options?.skip ?? 0;
        const take = options?.take ?? 10;
        const [items, totalItems] = await this.connection.getRepository(ctx, LibraryMaterial).findAndCount({
            skip,
            take,
            where: admin ? {} : { isPublic: true },
            order: { createdAt: 'DESC' }
        });
        return { items, totalItems };
    }

    async findOne(ctx: RequestContext, id: ID) {
        return this.connection.getRepository(ctx, LibraryMaterial).findOne({ where: { id } });
    }

    async create(ctx: RequestContext, input: any) {
        const material = new LibraryMaterial(input);
        return this.connection.getRepository(ctx, LibraryMaterial).save(material);
    }

    async update(ctx: RequestContext, input: any) {
        const material = await this.connection.getEntityOrThrow(ctx, LibraryMaterial, input.id);
        Object.assign(material, input);
        return this.connection.getRepository(ctx, LibraryMaterial).save(material);
    }

    async delete(ctx: RequestContext, id: ID) {
        const material = await this.connection.getEntityOrThrow(ctx, LibraryMaterial, id);
        await this.connection.getRepository(ctx, LibraryMaterial).remove(material);
        return true;
    }

    async trackDownload(ctx: RequestContext, id: ID) {
        const material = await this.connection.getEntityOrThrow(ctx, LibraryMaterial, id);
        material.downloadCount++;
        await this.connection.getRepository(ctx, LibraryMaterial).save(material);

        if (ctx.activeUserId) {
            const customer = await this.connection.getRepository(ctx, 'Customer').findOne({
                where: { user: { id: ctx.activeUserId } }
            });
            if (customer) {
                const download = new LibraryDownload({
                    materialId: id,
                    customerId: customer.id as any,
                });
                await this.connection.getRepository(ctx, LibraryDownload).save(download);
            }
        }
        return material;
    }

    async getMyDownloads(ctx: RequestContext) {
        if (!ctx.activeUserId) return [];
        const customer = await this.connection.getRepository(ctx, 'Customer').findOne({
            where: { user: { id: ctx.activeUserId } }
        });
        if (!customer) return [];
        
        const downloads = await this.connection.getRepository(ctx, LibraryDownload).find({
            where: { customerId: customer.id as any },
            order: { createdAt: 'DESC' }
        });

        // Map to include material info
        const result = [];
        for (const d of downloads) {
            const material = await this.findOne(ctx, d.materialId);
            if (material) {
                result.push({
                    ...d,
                    material
                });
            }
        }
        return result;
    }
}

@Resolver()
export class ShopLibraryResolver {
    constructor(private libraryService: LibraryService) {}

    @Query()
    libraryMaterials(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.libraryService.findAll(ctx, args.options);
    }

    @Query()
    libraryMaterial(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.libraryService.findOne(ctx, args.id);
    }

    @Query()
    myLibraryDownloads(@Ctx() ctx: RequestContext) {
        return this.libraryService.getMyDownloads(ctx);
    }

    @Mutation()
    trackDownload(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.libraryService.trackDownload(ctx, args.id);
    }
}

@Resolver()
export class AdminLibraryResolver {
    constructor(private libraryService: LibraryService) {}

    @Query()
    allLibraryMaterials(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.libraryService.findAll(ctx, args.options, true);
    }

    @Mutation()
    createLibraryMaterial(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.libraryService.create(ctx, args.input);
    }

    @Mutation()
    updateLibraryMaterial(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.libraryService.update(ctx, args.input);
    }

    @Mutation()
    deleteLibraryMaterial(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.libraryService.delete(ctx, args.id);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [LibraryMaterial, LibraryDownload],
    providers: [LibraryService],
    shopApiExtensions: {
        schema: shopSchema,
        resolvers: [ShopLibraryResolver],
    },
    adminApiExtensions: {
        schema: adminSchema,
        resolvers: [AdminLibraryResolver],
    },
})
export class LibraryPlugin {}
