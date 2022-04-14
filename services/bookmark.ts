import storage from 'infrastructure/storage';

export async function list(anonymous: boolean): Promise<IBookmarkConfiguration> {
  const data = (await storage.read<IBookmarkConfiguration>('bookmarks.yml')) || {
    bookmarks: [],
    categories: [],
  };

  return { ...data, bookmarks: data.bookmarks.filter(ele => (anonymous ? ele.private !== true : true)) };
}

export async function set(data: IBookmarkConfiguration): Promise<IBookmarkConfiguration> {
  const result = { ...data, lastModifiedAt: new Date().toISOString() };

  await storage.write('bookmarks.yml', result);

  return result;
}
