import fs from 'fs-extra';

export default async function Translation(language) {

    let ExistsLanguage = fs.existsSync(`./translation/${language?.toLowerCase()}.json`);

    if (ExistsLanguage) {

        let ReadLanguage = fs.readJsonSync(`./translation/${language?.toLowerCase()}.json`);

        return {
            number_topic: ReadLanguage?.number_topic,
            comment_posted: ReadLanguage?.comment_posted,
            first_link_your_account: ReadLanguage?.first_link_your_account,
            first_link_your_account_matrix: ReadLanguage?.first_link_your_account_matrix,
            writer: ReadLanguage?.writer,
            date: ReadLanguage?.date,
            publication_time: ReadLanguage?.publication_time,
            err_active_in_the_chat: ReadLanguage?.err_active_in_the_chat,
            active_bot: ReadLanguage?.active_bot,
            admin_activate: ReadLanguage?.admin_activate,
            category_id: ReadLanguage?.category_id,
            category_id_all: ReadLanguage?.category_id_all,
            id: ReadLanguage?.id,
            err_wrong_entry: ReadLanguage?.err_wrong_entry,
            send_category_id: ReadLanguage?.send_category_id,
            topic_title: ReadLanguage?.topic_title,
            topic_content: ReadLanguage?.topic_content,
            send_me_private_message_to_link_your_account: ReadLanguage?.send_me_private_message_to_link_your_account,
            err_linked_to_discourse: ReadLanguage?.err_linked_to_discourse,
            enter_your_username_discourse: ReadLanguage?.enter_your_username_discourse,
            sign_: ReadLanguage?.sign_,
            verification_code: ReadLanguage?.verification_code,
            verification_code_for: ReadLanguage?.verification_code_for,
            send_verification_code: ReadLanguage?.send_verification_code,
            write_verification_code: ReadLanguage?.write_verification_code,
            active_bridge: ReadLanguage?.active_bridge,
            err_verification_code: ReadLanguage?.err_verification_code,
            send_id_or_url_topic: ReadLanguage?.send_id_or_url_topic,
            write_comment: ReadLanguage?.write_comment,
            username_send_to: ReadLanguage?.username_send_to,
            title_message_private: ReadLanguage?.title_message_private,
            content_message_private: ReadLanguage?.content_message_private,
            message_sent: ReadLanguage?.message_sent,
            categories: ReadLanguage?.categories,
            number_of_topics_posted: ReadLanguage?.number_of_topics_posted,
            welcome: ReadLanguage?.welcome,
            in_the_bridge: ReadLanguage?.in_the_bridge,
            view_last_topic: ReadLanguage?.view_last_topic,
            view_categories: ReadLanguage?.view_categories,
            write_new_topic: ReadLanguage?.write_new_topic,
            write_new_comment: ReadLanguage?.write_new_comment,
            send_message_private: ReadLanguage?.send_message_private,
            link_your_account_to: ReadLanguage?.link_your_account_to,
            activate_the_bot: ReadLanguage?.activate_the_bot,
            send_number_or_name_service: ReadLanguage?.send_number_or_name_service,
            back_main_menu: ReadLanguage?.back_main_menu,
            wrong_data_entered: ReadLanguage?.wrong_data_entered,
            main_menu: ReadLanguage?.main_menu,
            back_main_menu_2: ReadLanguage?.back_main_menu_2
        }

    }

    else {
        let ReadLanguage = fs.readJsonSync(`./translation/ar.json`);

        return {
            number_topic: ReadLanguage?.number_topic,
            comment_posted: ReadLanguage?.comment_posted,
            first_link_your_account: ReadLanguage?.first_link_your_account,
            first_link_your_account_matrix: ReadLanguage?.first_link_your_account_matrix,
            writer: ReadLanguage?.writer,
            date: ReadLanguage?.date,
            publication_time: ReadLanguage?.publication_time,
            err_active_in_the_chat: ReadLanguage?.err_active_in_the_chat,
            active_bot: ReadLanguage?.active_bot,
            admin_activate: ReadLanguage?.admin_activate,
            category_id: ReadLanguage?.category_id,
            category_id_all: ReadLanguage?.category_id_all,
            id: ReadLanguage?.id,
            err_wrong_entry: ReadLanguage?.err_wrong_entry,
            send_category_id: ReadLanguage?.send_category_id,
            topic_title: ReadLanguage?.topic_title,
            topic_content: ReadLanguage?.topic_content,
            send_me_private_message_to_link_your_account: ReadLanguage?.send_me_private_message_to_link_your_account,
            err_linked_to_discourse: ReadLanguage?.err_linked_to_discourse,
            enter_your_username_discourse: ReadLanguage?.enter_your_username_discourse,
            sign_: ReadLanguage?.sign_,
            verification_code: ReadLanguage?.verification_code,
            verification_code_for: ReadLanguage?.verification_code_for,
            send_verification_code: ReadLanguage?.send_verification_code,
            write_verification_code: ReadLanguage?.write_verification_code,
            active_bridge: ReadLanguage?.active_bridge,
            err_verification_code: ReadLanguage?.err_verification_code,
            send_id_or_url_topic: ReadLanguage?.send_id_or_url_topic,
            write_comment: ReadLanguage?.write_comment,
            username_send_to: ReadLanguage?.username_send_to,
            title_message_private: ReadLanguage?.title_message_private,
            content_message_private: ReadLanguage?.content_message_private,
            message_sent: ReadLanguage?.message_sent,
            categories: ReadLanguage?.categories,
            number_of_topics_posted: ReadLanguage?.number_of_topics_posted,
            welcome: ReadLanguage?.welcome,
            in_the_bridge: ReadLanguage?.in_the_bridge,
            view_last_topic: ReadLanguage?.view_last_topic,
            view_categories: ReadLanguage?.view_categories,
            write_new_topic: ReadLanguage?.write_new_topic,
            write_new_comment: ReadLanguage?.write_new_comment,
            send_message_private: ReadLanguage?.send_message_private,
            link_your_account_to: ReadLanguage?.link_your_account_to,
            activate_the_bot: ReadLanguage?.activate_the_bot,
            send_number_or_name_service: ReadLanguage?.send_number_or_name_service,
            back_main_menu: ReadLanguage?.back_main_menu,
            wrong_data_entered: ReadLanguage?.wrong_data_entered,
            main_menu: ReadLanguage?.main_menu,
            back_main_menu_2: ReadLanguage?.back_main_menu_2
        }
    }

}