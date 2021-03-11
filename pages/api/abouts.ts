import { NextApiRequest, NextApiResponse } from 'next'
import { getAbouts } from '../../helpers/dtos';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IPostExcerptData[]>) {

    const data = await getAbouts() as IPostExcerptData[];

    res.status(200).json(data);
}

export default requestHandler;