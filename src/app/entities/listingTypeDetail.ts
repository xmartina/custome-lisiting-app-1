
export class FieldsAddForm {
    conditional_logic?: boolean;
    conditions?: {key?: string, compare?: string, value?: string}[][]; //value=id package or '' if always allowed
    default?: string;
    default_label?: string;
    description?: string;
    is_custom?: boolean;
    show_in_detail_view?: boolean;
    label?: string;
    placeholder?: string;
    priority?: number;
    required?: boolean;
    reusable?: boolean;
    show_in_admin?: boolean;
    show_in_submit_form?: boolean;
    multiple?: boolean;
    slug?: string;
    type?: string;
    format?: string;
}

export class ListingTypeDetail {
    ID?: number;
    case27_listing_type_fields?: any;
    case27_listing_type_search_page?: { advanced?: any, basic?: any, order?: any };
    case27_listing_type_single_page_options: {
        menu_items?: any,
        quick_actions?: any,
        cover_details?: {
            label?: string,
            field?: string,
            format?: string,
            prefix?: string,
            suffix?: string,
        }[],
        cover_actions?: any,
        similar_listings?: any,
        buttons?: any,
        buttons_as_quick_action?: any
    };
    case27_listing_type_result_template?: {
        template?: string, // alternate, default, list_view
        buttons?: {
            label?: string,
            show_field?: string // "__listing_rating", "work_hours", "__listing_rating", ...
        }[],
        info_fields?: {
            label?: string
            show_field?: string
            icon?: string
        }[],
        background?: { type?: string } //"image"
        footer?: {
            sections: {
                type?: string, //"categories"
                title?: string, //"Terms"
                taxonomy?: string, //"job_listing_category"
                show_bookmark_button?: boolean,
                show_quick_view_button?: boolean,
            }[]
        },
        quick_view?: {
            template?: string, // "default"
            map_skin?: string // "skin1"
        }
    };
    comment_count?: string;
    comment_status?: string;
    featured_media?: number;
    filter?: string;
    guid?: string;
    img_cover?: string;
    menu_order?: number;
    ping_status?: string;
    pinged?: string;
    post_author?: string;
    post_content?: string;
    post_content_filtered?: string;
    post_date?: string;
    post_date_gmt?: string;
    post_excerpt?: string;
    post_mime_type?: string;
    post_modified?: string;
    post_modified_gmt?: string;
    post_name?: string; //slug
    post_parent?: number;
    post_password?: string;
    post_status?: string;
    post_title?: string;
    post_type?: string;
    tags?: any[];
    categories?: any[];
    to_ping?: any;
    review_fields?: any[];
    /* Eg of a review field:
    {
        id: "hospitality"
        is_new: false
        label: "Hospitality"
        label_l10n: []
    }
    */
    icon?: string;


}
