import { read, write } from 'infrastructure/storage';

export async function list(): Promise<IBookmarkCollection> {
  const { categories, bookmarks } = (await read<IBookmarkConfiguration>('bookmarks.yml')) || {
    bookmarks: [],
    categories: [],
    favorites: [],
  };

  return { categories, bookmarks, favorites: bookmarks.filter(ele => ele.pined === true) };
}

export async function set(data: IBookmarkCollection): Promise<IBookmarkCollection> {
  const result = { ...data, lastModifiedAt: new Date().toISOString() };

  await write('bookmarks.yml', data);

  return result;
}
