import fs from 'fs';
import path from 'path';
import marked, { Renderer } from 'marked';
import Prism from 'prismjs';
import * as helpers from './helpers';

const renderer = new Renderer();
renderer.code = (code, lang) =>
  `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(code, Prism.languages[lang])}</code></pre>`;
marked.setOptions({ renderer });

const parsePost = (filename, postString) => {
  const [, metaString, contentString] = postString.match(/---([^]+)---\s+([^]+)/m);

  const meta = JSON.parse(metaString);
  const content = marked(contentString);

  return ({ ...meta, content });
};

const sortPosts = (posts) => {
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
};

const writeJson = (posts) => {
  fs.writeFileSync('db/posts.json', JSON.stringify(posts, null, 2));
  return posts;
};

const POST_DIR_PATH = path.resolve('db/posts');
const filenames = fs.readdirSync(POST_DIR_PATH);

const readFileAsPromise = filename => new Promise((resolve, reject) => {
  const filePath = path.join(POST_DIR_PATH, filename);
  fs.readFile(filePath, 'utf-8', (error, str) => {
    if (error) {
      reject(error);
    } else {
      const name = path.basename(filename, '.md');
      const post = parsePost(name, str);
      resolve({ name, ...post });
    }
  });
});

Promise.all(filenames.map(filename => readFileAsPromise(filename)))
  .then(sortPosts)
  .then(writeJson)
  .then((posts) => {
    posts.forEach(helpers.generatePost);
    Object
      .entries(helpers.getPostListsByTag(posts))
      .forEach(helpers.generateList);
  });

helpers.generateHome();

helpers.generateAbout();
