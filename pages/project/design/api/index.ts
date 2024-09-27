import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const fileContents = await fs.readFile("./database.json", 'utf8');
  const data = JSON.parse(fileContents);

  res.status(200).json(data);
}
