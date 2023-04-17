import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';

export default async function EventPosts(callback) {

    setInterval(async () => {

        try {

            let __dirname = path.resolve();
            let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
            let EventPostsJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/EventPosts.json"));
            let response = await fetch(process.env.URL || config?.url + `/posts.json`, { method: 'GET' });
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
                fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/EventPosts.json"), EventPostsJson);
            }

        } catch (error) {
            console.log(error);
        }

    }, 60000);

}
