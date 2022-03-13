import { read as readStorage } from 'infrastructure/storage';

export async function list(): Promise<AppCollectionData> {
  return (await readStorage<AppCollectionData>('apps.yml')) || { links: [] };
}