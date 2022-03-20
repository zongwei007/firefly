import { useMemo } from 'react';
import useSWR from 'swr';

export function useBookmarks() {
  const { data, error } = useSWR<IBookmarkCollection>('/api/bookmarks', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  const group = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.bookmarks.reduce((memo, bookmark) => {
      const key = bookmark.category || 'undefined';
      const collection = memo.get(key) || [];

      collection.push(bookmark);
      return memo.set(key, collection);
    }, new Map<ICategory['id'], Array<IBookmark>>());
  }, [data]);

  return {
    data: data && { ...data, categories: data.categories.concat({ id: 'undefined', name: '未分组' }) },
    error,
    group,
    isLoading: !error && !data,
  };
}
