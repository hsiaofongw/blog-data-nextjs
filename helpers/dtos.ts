import posts from '../data/articles.json';
import abouts from '../data/abouts.json';

export async function getPosts(): Promise<IPostExcerptData[]> {

    for (const p of posts) {

        const fileName = p.file;

        if ('prettyPath' in p) {
            ;
        }
        else {
            const matchForMarkdownSite = /^https:\/\/markdown\-blog\-phi\.vercel\.app\/posts\/(?<articleName>[\w\d\-]+)$/g;
            const matchForOldSite = /^https:\/\/beyondstars\.xyz\/posts\/(?<articleName>[\w\d\-]+)\/$/g;
            const matchForNewSite = /\/(?<articleName>[\w\d\-]+)\.pdf$/g;
            const markdownSiteMatchResult = matchForMarkdownSite.exec(fileName);
            const oldSiteMatchResult = matchForOldSite.exec(fileName);
            const newSiteMatchResult = matchForNewSite.exec(fileName);

            let articleName = '';

            if (markdownSiteMatchResult) {
                articleName = markdownSiteMatchResult?.groups?.articleName || 'unMatch-404';
            }

            if (oldSiteMatchResult) {
                articleName = oldSiteMatchResult?.groups?.articleName || 'unMatch-404';
            }

            if (newSiteMatchResult) {
                articleName = newSiteMatchResult?.groups?.articleName || 'unMatch-404';
            }

            p['prettyPath'] = `/posts/${articleName}`;
        }
    }

    return posts;
}

export async function getAbouts(): Promise<IPostExcerptData[]> {

    for (const p of abouts) {

        const fileName = p.file;

        if ('prettyPath' in p) {
            ;
        }
        else {
            const matchForNewSite = /\/(?<articleName>[\w\d\-]+)\.pdf$/g;
            const newSiteMatchResult = matchForNewSite.exec(fileName);

            let articleName = 'unMatch';

            if (newSiteMatchResult) {
                articleName = newSiteMatchResult.groups.articleName;
            }

            p['prettyPath'] = `/abouts/${articleName}`;
        }
    }

    return abouts;
}