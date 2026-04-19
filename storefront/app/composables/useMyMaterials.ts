import { useQuery } from '@urql/vue';
import { gql } from 'graphql-tag';
import { computed } from 'vue';

export const useMyMaterials = () => {
  const GET_MY_MATERIALS = gql`
    query GetMyMaterials {
      myDigitalMaterials {
        id
        activationDate
        productVariant {
            id
            name
            product {
                name
                featuredAsset {
                    preview
                }
            }
        }
        downloadUrl
      }
    }
  `;

  const { data, fetching, error, executeQuery } = useQuery({
    query: GET_MY_MATERIALS,
    requestPolicy: 'network-only'
  });

  return {
    materials: computed(() => data.value?.myDigitalMaterials || []),
    loading: fetching,
    error,
    refresh: executeQuery
  };
};
