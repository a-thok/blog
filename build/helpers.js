/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import fs from 'fs';
import marked from 'marked';
import Prism from 'prismjs';
import staticRender from './staticRender';
import { defaultState, PER_PAGE } from '../src/constants';

marked.setOptions({
  highlight(code, lang) {
    return Prism.highlight(code, Prism.languages[lang]);
  },
});

const pagePath = filename => path.resolve('public', `${filename}.html`);

export const parsePost = (name, postString) => {
  const matches = postString.match(/---([\s\S]+)---\s+([\s\S]+)/m);

  const meta = JSON.parse(matches[1]);
  const content = marked(matches[2]).replace(
    /<pre><code class="lang-(\w+)">/g,
    '<pre class="language-$1" data-lang="$1"><code class="language-$1">',
  );

  return ({ name, ...meta, content });
};

export const generatePostsJsonData = (posts) => {
  fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 2));
};

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

export const generatePostPage = (post) => {
  const state = { ...defaultState, post };
  const { title, name } = post;
  const url = `/blog/${name}`;

  const htmlString = staticRender({ state, title, url });
  fs.writeFileSync(pagePath(name), htmlString);
};

export const generatePostListPage = ([tag, list]) => {
  const pages = Math.ceil(list.length / PER_PAGE);
  let page = 1;

  while (list.length) {
    const posts = list
      .splice(0, PER_PAGE)
      .map(({ name, title, date }) => ({ name, title, date }));

    const state = {
      ...defaultState,
      posts,
      pages,
      page,
    };
    const title = 'blog - A Talk To Me';
    const url = '/blog';

    const htmlString = staticRender({ state, title, url });
    fs.writeFileSync(pagePath(`blog-${tag}-${page}`), htmlString);

    page += 1;
  }
};

export const generateIndexPage = () => {
  const htmlString = staticRender({
    state: defaultState,
    title: 'A Talk To Me',
    url: '/',
  });
  fs.writeFileSync(pagePath('index'), htmlString);
};

export const generateAboutPage = () => {
  const htmlString = staticRender({
    state: defaultState,
    title: 'About - A Talk To Me',
    url: '/about',
  });
  fs.writeFileSync(pagePath('about'), htmlString);
};
