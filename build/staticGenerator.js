import fs from 'fs';
import path from 'path';
import * as helpers from './helpers';

const readFileAsPromise = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf-8', (error, str) => {
    if (error) {
      reject(error);
    } else {
      const name = path.basename(filename, '.md');
      const post = helpers.parsePost(name, str);
      resolve(post);
    }
  });
});

const POST_DIR_PATH = path.resolve('posts');
const filenames = fs.readdirSync(POST_DIR_PATH);

Promise.all(
  filenames.map(filename => readFileAsPromise(path.join(POST_DIR_PATH, filename))),
)
  .then((posts) => {
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    helpers.generatePostsJsonData(posts);

    posts.forEach(helpers.generatePostPage);

    Object
      .entries(helpers.getPostListsByTag(posts))
      .forEach(helpers.generatePostListPage);
  });

helpers.generateIndexPage();

helpers.generateAboutPage();
