import { createClient, provideClient, cacheExchange, fetchExchange } from '@urql/vue';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Vendure Shop API endpoint
  const client = createClient({
    url: (config.public.apiTarget || 'http://localhost:3002') + '/shop-api',
    exchanges: [cacheExchange, fetchExchange],
    // In production, you would add authExchange here for Supabase/Vendure auth
  });

  nuxtApp.vueApp.provide('$urql', client);
  provideClient(client);

  return {
    provide: {
      urql: client
    }
  };
});
