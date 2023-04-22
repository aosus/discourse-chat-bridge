import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';

export default async function getCategories() {

    try {

        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        let response = await fetch(process.env.URL || config?.url + `/categories.json`, { method: 'GET' });
        let data = await response.json();

        if (data?.action && data?.errors) {

            return {
                action: data?.action,
                errors: data?.errors
            }

        }

        else {

            let array = []

            for (const item of data?.category_list?.categories) {

                if (item?.read_restricted === false) {

                    let opj = {

                        id: item?.id,
                        name: item?.name,
                        slug: item?.slug,
                        description: item?.description,
                        topics_day: item?.topics_day,
                        topics_week: item?.topics_week,
                        topics_month: item?.topics_month,
                        topics_all_time: item?.topics_all_time,

                    }

                    array.push(opj)

                }
            }

            return array

        }

    } catch (error) {

        console.log(error);

    }

}
