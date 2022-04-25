import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import request from 'infrastructure/request';

export function useBookmarks(anonymous?: boolean, filter?: string) {
  const { data, error, mutate } = useSWR<IBookmarkConfiguration>(`/api/bookmarks?anonymous=${!!anonymous}`, {
    revalidateOnFocus: false,
  });

  const { categories = [], bookmarks: bookmarkRaws = [], lastModifiedAt } = data || {};

  const bookmarks = useMemo(() => {
    if (!filter) {
      return bookmarkRaws;
    }

    const regExp = new RegExp(filter, 'i');
    return bookmarkRaws.filter(ele => [ele.name, ele.link, ele.desc].filter(Boolean).some(txt => txt!.match(regExp)));
  }, [bookmarkRaws, filter]);

  const result: IBookmarkCollection = {
    categories,
    bookmarks,
    favorites: bookmarks.filter(ele => ele.pined),
    lastModifiedAt,
  };

  const updater = useCallback(
    async ({ bookmarks, categories }: IBookmarkConfiguration) => {
      const data = await request<IBookmarkConfiguration>('/api/bookmarks', {
        body: JSON.stringify({ bookmarks, categories }),
        method: 'PUT',
      });

      mutate(data);
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
