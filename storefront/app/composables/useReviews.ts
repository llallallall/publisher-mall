import { useQuery, useMutation } from '@urql/vue';
import { gql } from 'graphql-tag';
import { computed, watchEffect } from 'vue';

export const useReviews = (productId: MaybeRefOrGetter<string>) => {
  const query = gql`
    query GetProductReviews($productId: ID!, $skip: Int, $take: Int) {
      productReviews(productId: $productId, skip: $skip, take: $take) {
        items {
          id
          createdAt
          authorName
          rating
          body
          source
        }
        totalItems
      }
    }
  `;

  const mutation = gql`
    mutation AddReview($input: CreateReviewInput!) {
      addReview(input: $input) {
        id
        state
      }
    }
  `;

  const { data, fetching, executeQuery, error } = useQuery({
    query,
    variables: computed(() => ({ 
      productId: toValue(productId), 
      skip: 0, 
      take: 10 
    }))
  });

  watchEffect(() => {
    if (data.value) console.log('Reviews Data:', data.value)
    if (error.value) console.error('Reviews Error:', error.value)
  })

  const { executeMutation } = useMutation(mutation);

  const addReview = async (authorName: string, rating: number, body: string) => {
    return executeMutation({
      input: { productId, authorName, rating, body }
    });
  };

  return {
    reviews: computed(() => data.value?.productReviews?.items || []),
    totalItems: computed(() => data.value?.productReviews?.totalItems || 0),
    loading: fetching,
    refresh: executeQuery,
    addReview
  };
};
