import useSWR from 'swr';

export function useApps() {
  const { data, error } = useSWR<AppCollectionData>('/api/apps');

  return { data, error, isLoading: !error && !data };
}
