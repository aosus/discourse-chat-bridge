import fetch from 'node-fetch';
import fs from 'fs-extra';

export default async function EventPosts(callback) {

    let config = fs.readJsonSync('config.json');

    setInterval(async () => {

        try {

            let EventPostsJson = fs.readJsonSync('./database/EventPosts.json');
            let response = await fetch(config?.url + `/posts.json`, { method: 'GET' });
            let data = await response.json();
            let item = data?.latest_posts[0]
            let id = item.id;

            if (data?.latest_posts[0]?.post_number === 1 && EventPostsJson.includes(id) === false) {

                callback({
                    name: item?.name,
                    username: item?.username,
                    created_at: item?.created_at,
                    post_number: item?.post_number,
                    post_type: item?.post_type,
                    topic_id: item?.topic_id,
                    topic_slug: item?.topic_slug,
                    topic_title: item?.topic_title,
                    category_id: item?.category_id,
                    cooked: item?.cooked,
                    raw: item?.raw,
                });
                EventPostsJson.push(id);
                fs.writeJsonSync('./database/EventPosts.json', EventPostsJson);
            }

        } catch (error) {
            console.log(error);
        }

    }, 60000);

}
