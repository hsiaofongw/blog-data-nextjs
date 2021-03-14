import { NextApiRequest, NextApiResponse } from 'next'
import { getPosts, getAbouts } from '../../../helpers/dtos';
import got from 'got';

let rules = {} as IRewriteRules;

async function buildRewriteRules(): Promise<IRewriteRules> {

    console.log({
        "datetime": new Date().toISOString(),
        "invoke": "buildRewriteRules"
    });

    let rules = {};

    let posts = await getPosts();
    for (const p of posts) {
        if (p.prettyPath) {
            const source = p.prettyPath;
            const destination = p.file;
            rules[source] = destination;
        }
    }

    let abouts = await getAbouts();
    for (const p of abouts) {
        if (p.prettyPath) {
            const source = p.prettyPath;
            const destination = p.file;
            rules[source] = destination;
        }
    }

    return rules;
}

async function requestForText(url: string, req: NextApiRequest, res: NextApiResponse) {

    console.log({
        "datetime": new Date().toISOString(),
        "invoke": "requestForText",
        "url": url
    });

    let { headers, body } = await got(url, {
        responseType: 'text'
    }).catch(e => {

        console.log({
            "datetime": new Date().toISOString(),
            "invoke": "requestForText",
            "url": url,
            "error": true,
            "error.message": e.message || "",
            "error.code": e.code || ""
        });

        return {
            headers: {},
            body: "404"
        };
    });

    body = body.replace(/href="\//g, 'href="');
    body = body.replace(/src="\//g, 'src="');
    res.send(body);
}

async function requestForBinary(url: string, req: NextApiRequest, res: NextApiResponse) {

    console.log({
        "datetime": new Date().toISOString(),
        "invoke": "requestForBinary",
        "url": url
    });

    let { headers, body } = await got(url, {
        responseType: 'buffer'
    }).catch(e => {
        console.log({
            "datetime": new Date().toISOString(),
            "invoke": "requestForBinary",
            "url": url,
            "error": true,
            "error.message": e.message || "",
            "error.code": e.code || ""
        });

        return {
            headers: {},
            body: "404"
        };
    });

    res.setHeader('content-type', headers['content-type'] || "text/plain");
    res.send(body);
}

async function rewriteForPost(prettyPath: string, req: NextApiRequest, res: NextApiResponse) {

    console.log({
        "datetime": new Date().toISOString(),
        "invoke": "rewriteForPost",
        "prettyPath": prettyPath,
        "req.url": req.url,
        "destination": rules[prettyPath] || ""
    });

    if (Object.keys(rules).length === 0) {
        rules = await buildRewriteRules();
    }

    if (prettyPath in rules) {
        const destination = rules[prettyPath];

        const pdfRegex = /\.pdf$/g;
        const matchPDF = pdfRegex.exec(destination);
        if (matchPDF) {
            await requestForBinary(destination, req, res);
        }
        else {
            await requestForText(destination, req, res);
        }
    }
    else {
        res.status(404).json({
            "msg": "No match post for this prettyPath",
            "prettyPath": prettyPath
        });
    }
}

async function rewriteForResource(resourceName: string, req: NextApiRequest, res: NextApiResponse) {
    const oldSiteURL = "https://markdown-blog-phi.vercel.app";
    const trueResourceURL = `${oldSiteURL}${resourceName}`;

    console.log({
        "datetime": new Date().toISOString(),
        "invoke": "rewriteForResource",
        "resourceName": resourceName,
        "req.url": req.url,
        "trueResourceURL": trueResourceURL
    });

    await requestForBinary(trueResourceURL, req, res);
}

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    console.log({
        "datetime": new Date().toISOString(),
        "invoke": "requestHandler",
        "req.url": req.url
    });

    const postRegex = /(?<prettyPath>\/(posts|abouts)\/[\w\d\-]+)$/g;
    const matchPost = postRegex.exec(req?.url || "");
    if (matchPost) {
        const prettyPath = matchPost?.groups?.prettyPath || "";
        if (prettyPath) {
            await rewriteForPost(prettyPath, req, res);
            return;
        }
    }

    const resourceRegex = /\/.+\/(posts|abouts)(?<resourceName>\/.+\.\w+)$/g;
    const matchResource = resourceRegex.exec(req?.url || "");
    if (matchResource) {
        const resourceName = matchResource?.groups?.resourceName || "";
        if (resourceName) {
            await rewriteForResource(resourceName, req, res);
            return;
        }
    }

    res.status(404).json({
        "msg": "Not Found!",
        "req.url": req.url
    });
}

export default requestHandler;