import { NextApiRequest, NextApiResponse } from 'next'
import blogBasicMetaData from '../../data/blog-basic-metadata.json';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IBlogBasicMetaData>) {

    const data = blogBasicMetaData as IBlogBasicMetaData;

    res.status(200).json(data);
}

export default requestHandler;