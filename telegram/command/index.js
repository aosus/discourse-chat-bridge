import activation from './activation.js';
import start from './start.js';
import get_latest_posts_ from './get_latest_posts.js';
import discourse from './discourse.js';
import getCategories_ from './getCategories.js';
import CreatePosts from './CreatePosts.js';
import sendComment from './sendComment.js';
import sendMessagePrivate from './sendMessagePrivate.js';

export default async function command(client, Markup) {

    try {

        await start(client, Markup);
        await activation(client);
        await get_latest_posts_(client);
        await discourse(client);
        await getCategories_(client);
        await CreatePosts(client);
        await sendComment(client);
        await sendMessagePrivate(client);

    } catch (error) {

        console.log(error);

    }

}