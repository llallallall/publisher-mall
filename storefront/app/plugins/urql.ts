import { createClient, cacheExchange, fetchExchange } from '@urql/vue';
import urql from '@urql/vue';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const client = createClient({
    url: (config.public.apiTarget || 'http://localhost:4000') + '/shop-api',
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      credentials: 'include',
    },
    requestPolicy: 'cache-and-network',
  });

  // This is the CRITICAL part for Nuxt 3/4 with @urql/vue
  nuxtApp.vueApp.use(urql, client);

  // Also provide it to Nuxt context
  return {
    provide: {
      urql: client
    }
  };
});
