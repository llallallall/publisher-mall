import { computed } from 'vue';

export const useProducts = async () => {
  const query = `
    query GetProducts($options: ProductListOptions) {
      products(options: $options) {
        items {
          id
          name
          slug
          description
          customFields {
            targetGrade
          }
          featuredAsset {
            preview
          }
          reviews {
            totalItems
          }
          variants {
            id
            price
            currencyCode
            customFields {
              productType
              bundleComponentIds
            }
          }
        }
        totalItems
      }
    }
  `;

  const config = useRuntimeConfig();
  // IPv6 resolution issue on Node.js fix
  const baseUrl = process.server ? 'http://127.0.0.1:4000' : (config.public.apiTarget || 'http://localhost:4000');
  const url = baseUrl + '/shop-api';

  const { data, pending, error, refresh } = await useAsyncData('products-list', async () => {
    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          query,
          variables: {
            options: {
              take: 100,
              skip: 0
            }
          }
        }
      });
      return response;
    } catch(e) {
      console.error("Fetch products error:", e);
      return { data: { products: { items: [], totalItems: 0 } } };
    }
  });

  return {
    products: computed(() => {
      // @ts-ignore
      const items = data.value?.data?.products?.items || [];
      return [...items]
    }),
    // @ts-ignore
    totalItems: computed(() => data.value?.data?.products?.totalItems || 0),
    loading: pending,
    error,
    refresh
  };
};
