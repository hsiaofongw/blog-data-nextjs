import { NextApiRequest, NextApiResponse } from 'next'
import { makeFeed } from '../../../helpers/feed';

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const feedObj = await makeFeed();
    const feed = feedObj?.json || "";

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(feed);
}

export default requestHandler;