import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';

export default async function get_latest_posts() {

    try {

        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        let response = await fetch(process.env.URL || config?.url + `/posts.json`, { method: 'GET' });
        let data = await response.json();

        if (data?.action && data?.errors) {

            return {
                action: data?.action,
                errors: data?.errors
            }

        }

        else {

            var la_po = true;

            if (la_po) {
                for (let item of data?.latest_posts) {
                    if (item?.post_number === 1) {
                        return {
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
                        }
                    }
                }

                var la_po = false
            }

            else if (la_po === false) {
                for (let item of data?.latest_posts) {
                    return {
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
                    }
                }
            }

        }

    } catch (error) {

        console.log(error);

    }

}
