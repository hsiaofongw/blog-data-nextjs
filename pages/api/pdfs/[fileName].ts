import { NextApiRequest, NextApiResponse } from 'next'


async function requestHandler(req: NextApiRequest, res: NextApiResponse) {


    const { fileName } = req.query;

    const resourceUrlPrefix = "https://hsiaofong-public-read.oss-accelerate.aliyuncs.com/latexblog/";
    const absURL = `${resourceUrlPrefix}${fileName}`;

    const resource = await fetch(absURL)
    .then(d => d.arrayBuffer())
    .then(d => Buffer.from(d));

    const cacheDays = 3;
    const cacheSeconds = cacheDays * 24 * 60 * 60;

    res.setHeader('Cache-Control', `public,max-age=${cacheSeconds}`);
    res.status(200).send(resource);
}

export default requestHandler;