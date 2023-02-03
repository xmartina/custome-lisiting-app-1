import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Post} from '../../../app/entities/post';
import {Constants} from '../../../app/Constants';
import {GlobalFields} from '../../GlobalFields';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Service} from '../../services/Service';
import {ModalPost} from '../modalPost/modalPost';


@Component({
  selector: 'postsPoage',
  templateUrl: 'postsPage.html',
  styleUrls: ['postsPage.scss']
})
export class PostsPage {

  Constants = Constants;
  GlobalFields = GlobalFields;

  posts: Post[] = [];

  loading = true;
  lastNumber = 20;
  page = 1;

  navigateAsRoot = false;

  constructor(public modalCtrl: ModalController, private statusBar: StatusBar, private service: Service) {


    this.loadMorePosts();
  }

  ionViewDidEnter() {
    //To avoid showing the back button if the navigation to this page is as root page
    this.navigateAsRoot = GlobalFields.navigateAsRoot;
    GlobalFields.navigateAsRoot = false;
  }

  loadMorePosts() {
    this.loading = true;
    this.service.getRecentPosts(this.page).subscribe((data: Post[]) => {
      if (data && data.length > 0) {
        this.posts = this.posts.concat(data);
        this.lastNumber = data.length;
        this.page = this.page + 1;
        this.loading = false;
        this.posts.forEach(post => {
          if (!post.img_cover)
            this.service.getMediaById(post.featured_media)
              .subscribe((data: any) => {
                  console.log('url: ' + data.source_url);
                  if (data) {
                    post.img_cover = data.source_url;
                  }
                }
              );
        });
      } else {
        this.lastNumber = 0;
        this.loading = false;
      }
    });
  }


  async openModalPost(post: Post) {

    const modal = await this.modalCtrl.create({
      component: ModalPost,
      componentProps: {post: post}
    });
    return await modal.present();
  }


}


