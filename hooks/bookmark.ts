import useSWR from 'swr';

export function useBookmarks() {
  const { data, error } = useSWR<BookmarkCollectionData>('/api/bookmarks');

  return { data, error, isLoading: !error && !data };
}
