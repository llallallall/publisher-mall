import { createClient, cacheExchange, fetchExchange } from '@urql/vue';
import urql from '@urql/vue';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Vendure Shop API endpoint
  const client = createClient({
    url: (config.public.apiTarget || 'http://localhost:4000') + '/shop-api',


    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      credentials: 'include',
    },
    // In production, add authExchange here
    requestPolicy: 'cache-and-network',
  });


  // Register URQL as a Vue plugin (Correct for Nuxt 3/4 with @urql/vue)
  nuxtApp.vueApp.use(urql, client);

  return {
    provide: {
      urql: client
    }
  };
});

