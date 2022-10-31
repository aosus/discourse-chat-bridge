import fetch from 'node-fetch';

export default async function getComment(topic_id, comment_id) {

    try {

        let response = await fetch(process.env.url + `/t/${topic_id}/posts.json`, { method: 'GET' });
        let data = await response.json();

        if (data?.action && data?.errors) {

            return {
                action: data?.action,
                errors: data?.errors
            }

        }

        else {

            if (comment_id) {

                return {

                    id: data?.post_stream?.posts[comment_id]?.id,
                    lengthComment: data?.post_stream?.posts?.length - 1,
                    username: data?.post_stream?.posts[comment_id]?.username,
                    cooked: data?.post_stream?.posts[comment_id]?.cooked,
                    post_number: data?.post_stream?.posts[comment_id]?.post_number,
                    post_type: data?.post_stream?.posts[comment_id]?.post_type,
                    reply_count: data?.post_stream?.posts[comment_id]?.reply_count,
                    reply_to_post_number: data?.post_stream?.posts[comment_id]?.reply_to_post_number,
                    topic_id: data?.post_stream?.posts[comment_id]?.topic_id,
                    topic_slug: data?.post_stream?.posts[comment_id]?.topic_slug,

                }

            }

            else {

                return {

                    all_comments: data?.post_stream?.posts

                }
            }

        }

    } catch (error) {

        console.log(error);

    }

}
