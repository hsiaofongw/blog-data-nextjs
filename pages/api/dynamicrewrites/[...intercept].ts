import { NextApiRequest, NextApiResponse } from 'next'
import { getPosts, getAbouts } from '../../../helpers/dtos';
import got from 'got';

let rules = {} as IRewriteRules;

async function buildRewriteRules(): Promise<IRewriteRules> {
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

async function requestToUpstream(url: string, req: NextApiRequest, res: NextApiResponse) {
    const response = got(url);

    const headers = (await response).headers;

    let buffer = await response.buffer();
    let text = await response.text();

    if (headers['content-type'] === 'text/html; charset=utf-8') {
        console.log("substituting");
        text = text.replace(/href="\//g, 'href="');
        text = text.replace(/src="\//g, 'src="');
        res.send(text);
    }
    else {
        res.setHeader('content-type', headers['content-type']);
        res.send(buffer);
    }

}

async function rewriteForPosts(prettyPath: string, req: NextApiRequest, res: NextApiResponse) {
    if (Object.keys(rules).length === 0) {
        rules = await buildRewriteRules();
    }

    let destination = "";
    if (prettyPath in rules) {
        destination = rules[prettyPath];
    }

    const logObject = {
        handler: "rewriteForPosts",
        prettyPath: prettyPath,
        destination: destination
    };

    for (const k in logObject) {
        res.setHeader(`x-rewrites-debug-info-${k}`, logObject[k]);
    }

    await requestToUpstream(destination, req, res);
}

async function rewriteForAbouts(prettyPath: string, req: NextApiRequest, res: NextApiResponse) {
    if (Object.keys(rules).length === 0) {
        rules = await buildRewriteRules();
    }

    let destination = "";
    if (prettyPath in rules) {
        destination = rules[prettyPath];
    }

    const logObject = {
        handler: "rewriteForAbouts",
        prettyPath: prettyPath,
        destination: destination
    };

    for (const k in logObject) {
        res.setHeader(`x-rewrites-debug-info-${k}`, logObject[k]);
    }

    await requestToUpstream(destination, req, res);
}

async function rewriteForResources(resourceName: string, req: NextApiRequest, res: NextApiResponse) {
    const oldSiteURL = "https://beyondstars.xyz";
    const trueResourceURL = `${oldSiteURL}${resourceName}`;

    const logObject = {
        handler: "rewriteForResources",
        resourceName: resourceName,
        trueResourceURL: trueResourceURL
    };

    for (const k in logObject) {
        res.setHeader(`x-rewrites-debug-info-${k}`, logObject[k]);
    }

    await requestToUpstream(trueResourceURL, req, res);
}

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const matchForPostsPrettyPath = /(?<prettyPath>\/posts\/[\w\d\-]+)$/g;
    const matchForAboutsPrettyPath = /(?<prettyPath>\/abouts\/[\w\d\-]+)$/g;
    const matchForOldSiteResource = /\/posts(?<resourceName>\/.+\.[\w]{1,})$/g;

    const postsMatchResult = matchForPostsPrettyPath.exec(req.url);
    const aboutsMatchResult = matchForAboutsPrettyPath.exec(req.url);
    const resourceMatchResult = matchForOldSiteResource.exec(req.url);
    
    if (postsMatchResult) {
        if (postsMatchResult.groups) {
            const prettyPath = postsMatchResult.groups.prettyPath;
            await rewriteForPosts(prettyPath, req, res);
        }
    }
    else if (aboutsMatchResult) {
        if (aboutsMatchResult.groups) {
            const prettyPath = aboutsMatchResult.groups.prettyPath;
            await rewriteForAbouts(prettyPath, req, res);
        }
    }
    else if (resourceMatchResult) {
        if (resourceMatchResult.groups) {
            const resourceName = resourceMatchResult.groups.resourceName;
            await rewriteForResources(resourceName, req, res);
        }
    }
    else {
        res.status(404).json({
            "msg": "Not Found!"
        });
    }
}

export default requestHandler;