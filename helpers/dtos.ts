import posts from '../data/articles.json';
import abouts from '../data/abouts.json';

export async function getPosts(): Promise<IPostExcerptData[]> {

    for (const p of posts) {

        const fileName = p.file;

        if ('prettyPath' in p) {
            ;
        }
        else {
            const pdfRegex = /\/(?<postId>[\w\d\-]+)\.pdf$/g;
            const markdownRegex = /markdown-blog-phi\.vercel\.app\/posts\/(?<postId>[\w\d\-]+)$/g;

            const matchForPDf= pdfRegex.exec(fileName);
            const matchForMarkdown = markdownRegex.exec(fileName);

            const postId = matchForPDf?.groups?.postId || matchForMarkdown?.groups?.postId || "unMatch";

            p['prettyPath'] = `/posts/${postId}`;
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