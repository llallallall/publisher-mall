import { useQuery, useMutation } from '@urql/vue';
import { gql } from 'graphql-tag';

const GET_ACTIVE_CUSTOMER = gql`
  query GetActiveCustomer {
    activeCustomer {
      id
      emailAddress
      firstName
      lastName
    }
  }
`;

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password, rememberMe: true) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const AUTHENTICATE = gql`
  mutation Authenticate($input: AuthenticationInput!) {
    authenticate(input: $input) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

const REGISTER = gql`
  mutation Register($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const useAuth = () => {
  const { data, fetching, executeQuery } = useQuery({
    query: GET_ACTIVE_CUSTOMER,
    pause: process.server, // Don't run on server if using cookie-based auth without proper relay
  });

  const { executeMutation: loginMutation } = useMutation(LOGIN);
  const { executeMutation: authenticateMutation } = useMutation(AUTHENTICATE);
  const { executeMutation: logoutMutation } = useMutation(LOGOUT);
  const { executeMutation: registerMutation } = useMutation(REGISTER);

  const user = computed(() => data.value?.activeCustomer);
  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    isAuthenticated,
    loading: fetching,
    refresh: executeQuery,
    
    login: async (username: string, password: string) => {
      const result = await loginMutation({ username, password });
      if (result.data?.login?.id) {
        await executeQuery({ requestPolicy: 'network-only' });
      }
      return result;
    },

    authenticateWithSupabase: async (token: string) => {
      const result = await authenticateMutation({
        input: {
          supabase: { token }
        }
      });
      if (result.data?.authenticate?.id) {
        await executeQuery({ requestPolicy: 'network-only' });
      }
      return result;
    },
    
    register: async (input: any) => {
      return registerMutation({ input });
    },
    
    logout: async () => {
      const result = await logoutMutation({});
      await executeQuery({ requestPolicy: 'network-only' });
      return result;
    }
  };
};
