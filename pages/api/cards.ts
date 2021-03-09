import { NextApiRequest, NextApiResponse } from 'next'
import cards from '../../data/cards.json';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<ICardData[]>) {

    const data = cards as ICardData[];

    res.status(200).json(data);
}

export default requestHandler;