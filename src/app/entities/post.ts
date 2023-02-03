
export class Post {
  author?: number;
  better_featured_image?: {id: number, media_details?: {file?: string}};
  categories?: number[];
  comment_status?: string; //"open"
  content?: {rendered: string}; //render è l'html del body
  excerpt?: {rendered: string}; //render è l'html del sottotitolo
  date?: string;
  date_gmt?: string;
  featured_media?: number; //id del media
  format: "standard";
  id?: number;
  img_cover?: string;
  link?: string;
  pure_taxonomies?: any[]; //categorie e tag
  status: string;
  tags?: number[];
  title?: {rendered?: string}; //titolo

}
