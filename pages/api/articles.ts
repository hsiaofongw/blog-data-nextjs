import { NextApiRequest, NextApiResponse } from 'next'
import articles from '../../data/articles.json';
import { getPosts } from '../../helpers/dtos';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IPostExcerptData[]>) {

    const data = await getPosts() as IPostExcerptData[];

    res.status(200).json(data);
}

export default requestHandler;