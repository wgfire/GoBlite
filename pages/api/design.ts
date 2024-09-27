import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jsonDirectory = 'pages/project/design/api'
  const fileContents = await fs.readFile(path.join(jsonDirectory, 'database.json'), 'utf8');
  const data = JSON.parse(fileContents);

  res.status(200).json(data);
}
