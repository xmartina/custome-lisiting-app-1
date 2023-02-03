import {User} from "./user";

export class Section {

  id? : number;
  title?: string;
  text? : string;
  img?: string;

}

export class House {

  id ?: number;
  title ?: string;
  description ?: string;
  cover ?: string = "http://diysolarpanelsv.com/images/cook-book-clip-art-20.jpg";
  likes ?: number = 0;
  comments ?: number = 0;
  sections ?: Section[] = [];
  date ?: number = (new Date()).getTime();
  author?: User;

}
