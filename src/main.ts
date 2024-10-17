import { BotAPI} from '@api/api';
import { Posts, Post as PostInterface } from '@models/Post'; 
import {dateFormat3} from '@core/helpers/date';
import {checkPosition, throttle} from '@core/helpers/ui';
import {generator} from '@core/helpers/iterators';
import Post from '@components/Post';
import Image from '@components/Image';
import DivBlock from '@components/DivBlock';

const list = document.getElementById('list');
const buffer: any[] = []; // буфер для считывания данных из json
let mediaGroup = 0; // глаобальный media group id для вычисления сосавных постов
let imgs = []; // буфер для картинок для составных постов
const posts: Post[] = []; // буфер для составных постов

/*
  Main
*/
(async () => {
  const data: Posts = await BotAPI().getUpdates('@art_basement');   
  const gen = generator(data.result);

  // загружается первые посты
  while (list.offsetHeight < window.innerHeight) {
    fillBuffer(gen);
    renderPosts();
  }

  const func = () => checkPosition(gen, (gen) => {
    fillBuffer(gen);
    renderPosts();
  });
  
  window.addEventListener('scroll', throttle(func, 250));
  window.addEventListener('resize', throttle(func, 250));
})();

/*
  Счиывание постов в буфер пока у постов одинаковый id медиа группы.
*/
function fillBuffer (gen: Generator) {
  let t: any = gen.next();
  let group_id = 0;

  if (t.done) return;

  buffer.push(t);

  if (t.value.channel_post.media_group_id) {
    group_id = t.value.channel_post.media_group_id;

    while (group_id == t.value.channel_post.media_group_id) {
      group_id = getGroupId(t.value);
      t = gen.next();

      if (t.done) {
        console.log(buffer);
        break;
      }

      buffer.push(t);
    }
  }
}

/*
  Компиляция поста состоящего из нескольких записей
*/
function renderPosts() {
  let el = buffer.shift();

  if (!el || (el && el.done)) {
    return;
  }

  let group_id = getGroupId(el.value);
  
  if (group_id != 0 && buffer.length > 0) {
    renderPost(el, isPostLast(group_id));

    el = buffer.shift();

    if (!el || (el && el.done)) {
      return;
    }

    while (el && (group_id == el.value.channel_post.media_group_id || !el.done)) {
      renderPost(el, isPostLast(group_id));
      group_id = getGroupId(el.value);
      el = buffer.shift();
    }

    if (el && group_id != el.value.channel_post.media_group_id) {
      buffer.push(el);
    }

  } else {
    renderPost(el);
  }
}

function isPostLast (group_id: number) {
  return buffer.length == 0 || buffer[0].value.channel_post.media_group_id != group_id;
}

function getGroupId (el: PostInterface) {
  return el.channel_post.media_group_id
    ? el.channel_post.media_group_id
    : 0;
}

/*
  рендер поста в DOM
*/
function renderPost(data: any, last: boolean = false) {
  const el: PostInterface = data.value;

  if (el.channel_post.media_group_id && !mediaGroup) {
    mediaGroup = el.channel_post.media_group_id;

    const date = new Date(el.channel_post.date * 1000);
    const header = new DivBlock(dateFormat3(date), 'header');

    imgs.push(header);

    const post = new Post(el);
    posts.push(post);

  } else if(!el.channel_post.media_group_id && mediaGroup) {
    mediaGroup = 0;

  } else if (!mediaGroup) {
    const date = new Date(el.channel_post.date * 1000);
    const header = new DivBlock(dateFormat3(date), 'header');
    imgs.push(header);

    const post = new Post(el);
    posts.push(post);
  }

  const img = new Image(el.channel_post.photo);

  imgs.push(img);

  if (!mediaGroup || last) {
    const container = new DivBlock([
      ...imgs.map(el => el.render()),
      posts.pop().render()
    ], 'post');

    imgs = [];

    list.appendChild(container.render());
  }
}
