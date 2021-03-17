import { getBlogBasicMetaData, getPosts } from './dtos';
import { Feed } from 'feed';

export async function makeFeed() {
    const metaData = await getBlogBasicMetaData();
    const posts = await getPosts();

    const title = metaData.title;
    const description = metaData.description;
    const id = "https://exploro.one";
    const link  = "https://exploro.one";
    const favicon = "https://www.gravatar.com/avatar/dfa26ed25a72c40d602d33d854dd6f07?s=200";
    const copyright = "All rights reserved 2021, Hsiao-Fong Wayne";
    const updated = new Date(posts[0].date);
    const generator = "Next.js";

    const feedLinks = {
        json: "https://exploro.one/feed/json",
        atom: "https://exploro.one/feed/atom"
    };

    const author = {
        name: "H. Wayne",
        email: "hsiaofong.w@gmail.com",
        link: "https://exploro.one"
    };

    let feed = new Feed({
        title, description, id, link, 
        favicon, copyright, updated, generator,
        feedLinks, author
    });

    posts.forEach(post => {
        const title = post.name;
        const id = post.file;
        let link = post.file;
        if (post.prettyPath) {
            link = `https://exploro.one${post.prettyPath}`;
        }
        const description = post.description;
        const date = new Date(post.date);

        feed.addItem({
            title, id, link, description, date
        });
    });

    feed.addCategory("Technology");

    return {
        rss2: feed.rss2(),
        atom1: feed.atom1(),
        atom: feed.atom1(),
        json: feed.json1()
    };
}