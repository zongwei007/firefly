import { NextApiRequest, NextApiResponse } from 'next';
import { read as readStorage } from 'services/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse<AppCollectionData | ErrorResponse>) {
  try {
    const config = (await readStorage<AppCollectionData>('apps.yml')) || { links: [] };

    res.status(200).json(config);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
