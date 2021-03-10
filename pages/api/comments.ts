import { NextApiRequest, NextApiResponse } from 'next'
import examplecomments from '../../data/examplecomments.json';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<ICommentData[]>) {

    const data = examplecomments as ICommentData[];

    res.status(200).json(data);
}

export default requestHandler;