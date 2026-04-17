import { useQuery } from '@urql/vue';
import { gql } from 'graphql-tag';

export const useProducts = () => {
  const GET_PRODUCTS = gql`
    query GetProducts($options: ProductListOptions) {
      products(options: $options) {
        items {
          id
          name
          slug
          description
          featuredAsset {
            preview
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

  const { data, fetching, error, executeQuery } = useQuery({
    query: GET_PRODUCTS,
    variables: {
      options: {
        take: 10,
        skip: 0
      }
    }
  });

  return {
    products: computed(() => data.value?.products?.items || []),
    totalItems: computed(() => data.value?.products?.totalItems || 0),
    loading: fetching,
    error,
    refresh: executeQuery
  };
};
