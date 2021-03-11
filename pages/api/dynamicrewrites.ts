import { NextApiRequest, NextApiResponse } from 'next'


async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    res.status(200).json({
        req: req.url
    });
}

export default requestHandler;