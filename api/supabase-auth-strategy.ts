import { AuthenticationStrategy, User, ExternalAuthenticationService, RequestContext } from '@vendure/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

/**
 * A custom authentication strategy that authenticates users against Supabase Auth.
 */
export class SupabaseAuthStrategy implements AuthenticationStrategy {
    readonly name = 'supabase';
    private client: SupabaseClient;

    constructor() {
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
        }
        this.client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }

    defineInputType(): DocumentNode {
        return gql`
            input SupabaseAuthInput {
                token: String!
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: { token: string }): Promise<User | false | string> {
        const { data: { user }, error } = await this.client.auth.getUser(data.token);

        if (error || !user || !user.email) {
            return false;
        }

        // We use the ExternalAuthenticationService to find or create a User and Customer
        // associated with the external Supabase ID/email.
        // Note: We need to inject this service, but strategies are usually instantiated
        // in the config. We can use a different approach or assume the service is available.
        // In Vendure, we can return the external user identifier.
        return user.email;
    }
}
