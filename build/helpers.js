import path from 'path';
import fs from 'fs';
import { createStore } from 'redux';
import rootReducer from '../src/store/reducers';
import staticRenderer from './staticRenderer';

const DIST_PATH = path.resolve('dist');
try {
  fs.statSync(DIST_PATH);
} catch (e) {
  fs.mkdirSync(DIST_PATH);
}
const pagePath = filename => path.resolve(DIST_PATH, `${filename}.html`);

/* eslint-disable no-param-reassign */
export const getPostListsByTag = (posts) => {
  const result = posts.reduce((arr, post) => {
    post.tags.forEach((tag) => {
      if (arr[tag]) {
        arr[tag].push(post);
      } else {
        arr[tag] = [post];
      }
    });
    return arr;
  }, []);

  result.all = [...posts];

  return result;
};

export const generatePost = (post) => {
  const store = createStore(rootReducer, { post });
  const { title, name } = post;
  const url = `/blog/${name}`;

  const htmlString = staticRenderer({ store, title, url });
  fs.writeFileSync(pagePath(name), htmlString);
};

export const generateList = ([tag, allPosts]) => {
  const PER_PAGE = 5;
  let page = 1;
  const total = allPosts.length;

  while (allPosts.length) {
    const posts = allPosts
      .splice(0, PER_PAGE)
      .map(({ name, title, date }) => ({ name, title, date }));

    const store = createStore(rootReducer, { list: { posts, page, total, tag } });
    const title = 'blog - A Talk To Me';
    const url = '/blog';

    fs.writeFileSync(
      pagePath(`blog-${tag}-${page}`),
      staticRenderer({ store, title, url }),
    );

    page += 1;
  }
};

export const generateHome = () => {
  fs.writeFileSync(
    pagePath('index'),
    staticRenderer({
      store: createStore(rootReducer),
      title: 'A Talk To Me',
      url: '/',
    }),
  );
};

export const generateAbout = () => {
  fs.writeFileSync(
    pagePath('about'),
    staticRenderer({
      store: createStore(rootReducer),
      title: 'About - A Talk To Me',
      url: '/about',
    }),
  );
};
