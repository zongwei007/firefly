import { read as readStorage } from 'infrastructure/storage';

export async function list(): Promise<IAppCollection> {
  return (await readStorage<IAppCollection>('apps.yml')) || { links: [] };
}
