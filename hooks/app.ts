import useSWR from 'swr';

export function useApps() {
  const { data, error } = useSWR<AppCollectionData>('/api/apps', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return { data, error, isLoading: !error && !data };
}
