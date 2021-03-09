import { NextApiRequest, NextApiResponse } from 'next'
import abouts from '../../data/abouts.json';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IPostExcerptData[]>) {

    const data = abouts as IPostExcerptData[];

    res.status(200).json(data);
}

export default requestHandler;