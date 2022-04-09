import { read, write } from 'infrastructure/storage';

export async function list(): Promise<IBookmarkConfiguration> {
  const { categories, bookmarks } = (await read<IBookmarkConfiguration>('bookmarks.yml')) || {
    bookmarks: [],
    categories: [],
  };

  return { categories, bookmarks };
}

export async function set(data: IBookmarkConfiguration): Promise<IBookmarkConfiguration> {
  const result = { ...data, lastModifiedAt: new Date().toISOString() };

  await write('bookmarks.yml', data);

  return result;
}
