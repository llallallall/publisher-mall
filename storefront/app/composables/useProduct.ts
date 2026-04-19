import { computed, type Ref } from 'vue';

export const useProduct = (slug: string | Ref<string>) => {
  const query = `
    query GetProduct($slug: String!) {
      product(slug: $slug) {
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
        variants {
          id
          name
          sku
          price
          currencyCode
          customFields {
            productType
            bundleComponentIds
          }
        }
      }
    }
  `;

  const config = useRuntimeConfig();
  const baseUrl = process.server ? 'http://127.0.0.1:4000' : (config.public.apiTarget || 'http://localhost:4000');
  const url = baseUrl + '/shop-api';

  // 반응형 슬러그 처리
  const slugValue = computed(() => typeof slug === 'string' ? slug : slug.value);

  const { data, pending, error, refresh } = useAsyncData(
    () => `product-${slugValue.value}`, 
    async () => {
      if (!slugValue.value) return null;
      try {
        const response = await $fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            query,
            variables: { slug: slugValue.value }
          }
        });
        return response;
      } catch(e) {
        console.error("Fetch product error:", e);
        return null;
      }
    },
    { watch: [slugValue] } // 슬러그 변경 시 자동 리프레시
  );

  return {
    // @ts-ignore
    product: computed(() => data.value?.data?.product),
    loading: pending,
    error,
    refresh
  };
};
