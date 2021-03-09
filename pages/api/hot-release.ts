import { NextApiRequest, NextApiResponse } from 'next'
import articles from '../../data/hot-release.json';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IPostExcerptData[]>) {

    const data = articles as IPostExcerptData[];

    res.status(200).json(data);
}

export default requestHandler;