import { useQuery, useMutation } from '@urql/vue';
import { gql } from 'graphql-tag';

const GET_ACTIVE_ORDER = gql`
  query GetActiveOrder {
    activeOrder {
      id
      code
      state
      totalWithTax
      currencyCode
      totalQuantity
      lines {
        id
        productVariant {
          id
          name
          product {
            featuredAsset {
              preview
            }
          }
        }

        quantity
        linePriceWithTax
      }
    }
  }
`;

const ADD_ITEM = gql`
  mutation AddItem($variantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const ADJUST_LINE = gql`
  mutation AdjustLine($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const REMOVE_LINE = gql`
  mutation RemoveLine($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      ... on Order {
        id
        totalQuantity
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const ADD_PAYMENT = gql`
  mutation AddPayment($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        state
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const useCart = () => {
  const isCartOpen = useState('isCartOpen', () => false);
  
  const { data, fetching, error, executeQuery } = useQuery({
    query: GET_ACTIVE_ORDER,
  });

  const { executeMutation: addItemMutation } = useMutation(ADD_ITEM);
  const { executeMutation: adjustLineMutation } = useMutation(ADJUST_LINE);
  const { executeMutation: removeLineMutation } = useMutation(REMOVE_LINE);
  const { executeMutation: addPaymentMutation } = useMutation(ADD_PAYMENT);

  return {
    cart: computed(() => data.value?.activeOrder),
    loading: fetching,
    error,
    refresh: executeQuery,
    isCartOpen,
    openCart: () => (isCartOpen.value = true),
    closeCart: () => (isCartOpen.value = false),
    
    addItem: async (variantId: string, quantity: number = 1) => {
      const result = await addItemMutation({ variantId, quantity });
      await executeQuery();
      return result;
    },
    adjustQuantity: async (lineId: string, quantity: number) => {
      const result = await adjustLineMutation({ lineId, quantity });
      await executeQuery();
      return result;
    },
    removeItem: async (lineId: string) => {
      const result = await removeLineMutation({ lineId });
      await executeQuery();
      return result;
    },
    addPayment: async (imp_uid: string) => {
      return addPaymentMutation({
        input: {
          method: 'portone-payment',
          metadata: { imp_uid }
        }
      });
    }
  };
};

