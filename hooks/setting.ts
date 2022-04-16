import useSWR from 'swr';
import { useCallback } from 'react';
import request from 'infrastructure/request';

export function useSettings() {
  const { data, error, mutate } = useSWR<ISetting>('/api/settings', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  const updater = useCallback(
    async value => {
      const data = await request<ISetting>('/api/settings', {
        body: JSON.stringify(value),
        method: 'PUT',
      });

      mutate(data);
    },
    [mutate]
  );

  return { data, error, isLoading: !error && !data, mutate: updater };
}
