import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

export function useBookmarks() {
  const { data, error, mutate } = useSWR<IBookmarkCollection>('/api/bookmarks', {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  const updater = useCallback(
    async (value: IBookmarkCollection) => {
      const resp = await fetch('/api/bookmarks', {
        body: JSON.stringify({ bookmarks: value.bookmarks, categories: value.categories }),
        method: 'PUT',
      });

      mutate(await resp.json());
    },
    [mutate]
  );

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
    data,
    error,
    group,
    mutate: updater,
    isLoading: !error && !data,
  };
}
