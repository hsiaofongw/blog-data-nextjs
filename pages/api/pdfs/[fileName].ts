import { NextApiRequest, NextApiResponse } from 'next'
import { getFile } from '../../../helpers/aliyunoss';

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    let fileName = (req.query?.fileName as string) || "unknowFileName";

    const content = await getFile(fileName);
    res.send(content);
}

export default requestHandler;