import { useQuery, useMutation } from '@urql/vue';
import { gql } from 'graphql-tag';
import { computed, watchEffect } from 'vue';

export const useLibrary = (category?: string) => {
  const GET_MATERIALS = gql`
    query GetLibraryMaterials($options: LibraryListOptions) {
      libraryMaterials(options: $options) {
        items {
          id
          createdAt
          title
          description
          fileUrl
          category
          requireLogin
          downloadCount
        }
        totalItems
      }
    }
  `;

  const GET_MY_DOWNLOADS = gql`
    query GetMyDownloads {
      myLibraryDownloads {
        id
        createdAt
        material {
          id
          title
          fileUrl
        }
      }
    }
  `;

  const TRACK_DOWNLOAD = gql`
    mutation TrackDownload($id: ID!) {
      trackDownload(id: $id) {
        id
        downloadCount
      }
    }
  `;

  const { data, fetching, error, executeQuery } = useQuery({
    query: GET_MATERIALS,
    variables: computed(() => ({ 
      options: { 
        skip: 0, 
        take: 50,
        filter: category ? { category: { eq: category } } : undefined
      } 
    }))
  });

  // Log for debugging
  watchEffect(() => {
    if (data.value) console.log('Library Data:', data.value);
    if (error.value) console.error('Library Error:', error.value);
  });

  const { data: myDownloadsData, executeQuery: fetchMyDownloads } = useQuery({
    query: GET_MY_DOWNLOADS,
    pause: true 
  });

  const { executeMutation: executeTrackDownload } = useMutation(TRACK_DOWNLOAD);

  const trackDownload = async (id: string) => {
    return executeTrackDownload({ id });
  };

  return {
    materials: computed(() => data.value?.libraryMaterials?.items || []),
    totalItems: computed(() => data.value?.libraryMaterials?.totalItems || 0),
    myDownloads: computed(() => myDownloadsData.value?.myLibraryDownloads || []),
    loading: fetching,
    error,
    refresh: executeQuery,
    fetchMyDownloads,
    trackDownload,
    categories: ['ANSWER', 'ANALYSIS', 'GUIDE'] as const
  };
};
