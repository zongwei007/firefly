import useSWR from 'swr';
import { useCallback } from 'react';

export function useSettings() {
  const { data, error, mutate } = useSWR<ISetting>('/api/settings', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  const updater = useCallback(
    async value => {
      const resp = await fetch('/api/settings', {
        body: JSON.stringify(value),
        method: 'PUT',
      });

      mutate(await resp.json());
    },
    [mutate]
  );

  return { data, error, isLoading: !error && !data, mutate: updater };
}
