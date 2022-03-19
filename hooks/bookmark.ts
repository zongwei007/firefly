import useSWR from 'swr';

export function useBookmarks() {
  const { data, error } = useSWR<IBookmarkCollection>('/api/bookmarks', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return { data, error, isLoading: !error && !data };
}
