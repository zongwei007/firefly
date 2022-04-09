import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

export function useBookmarks(anonymous?: boolean, filter?: string) {
  const { data, error, mutate } = useSWR<IBookmarkConfiguration>(`/api/bookmarks?anonymous=${!!anonymous}`, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  const { categories = [], bookmarks: bookmarkRaws = [], lastModifiedAt } = data || {};

  const bookmarks = useMemo(
    () =>
      bookmarkRaws.filter(
        ele => !filter || ele.name.includes(filter) || ele.link.includes(filter) || ele.desc?.includes(filter)
      ),
    [bookmarkRaws, filter]
  );

  const result: IBookmarkCollection = {
    categories,
    bookmarks,
    favorites: bookmarks.filter(ele => ele.pined),
    lastModifiedAt,
  };

  const updater = useCallback(
    async ({ bookmarks, categories }: IBookmarkConfiguration) => {
      const resp = await fetch('/api/bookmarks', {
        body: JSON.stringify({ bookmarks, categories }),
        method: 'PUT',
      });

      mutate(await resp.json());
    },
    [mutate]
  );

  const group = useMemo(() => {
    if (!bookmarks) {
      return null;
    }

    return bookmarks.reduce((memo, bookmark) => {
      const key = bookmark.category || 'undefined';
      const collection = memo.get(key) || [];

      collection.push(bookmark);
      return memo.set(key, collection);
    }, new Map<ICategory['id'], Array<IBookmark>>());
  }, [bookmarks]);

  return {
    data: result,
    error,
    group,
    mutate: updater,
    isLoading: !error && !data,
  };
}
