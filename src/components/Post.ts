import { Post as PostInterface } from '@models/Post';

export default class Post {
  data: PostInterface | null;
  container: HTMLElement = document.createElement('div');

  constructor (data: PostInterface) {
    this.data = data;
    this.container.setAttribute('class', 'text');
  }

  async getImg() {

  }

  render() {
    this.container.textContent =
      this.data.channel_post.photo
        ? this.data.channel_post.caption
        : this.data.channel_post.text;

    return this.container;
  }
}