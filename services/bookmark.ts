import { read as readStorage } from 'infrastructure/storage';

export async function list(): Promise<IBookmarkCollection> {
  const { categories, bookmarks } = (await readStorage<IBookmarkConfiguration>('bookmarks.yml')) || {
    bookmarks: [],
    categories: [],
    favorites: [],
  };

  return { categories, bookmarks, favorites: bookmarks.filter(ele => ele.category === 'favorite') };
}
