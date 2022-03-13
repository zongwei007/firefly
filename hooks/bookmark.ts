import useSWR from 'swr';

export function useBookmarks() {
  const { data, error } = useSWR<BookmarkCollectionData>('/api/bookmarks', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return { data, error, isLoading: !error && !data };
}
