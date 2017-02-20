const fs = require('fs');
const path = require('path');

const POST_DIR_PATH = path.join(__dirname, 'posts');

const getPostData = (filename, postStr) => {
  const matches = postStr.match(/---([\s\S]+)---\s+([\s\S]+)/m);
  const meta = JSON.parse(matches[1]);
  return Object.assign(meta, {
    name: path.basename(filename, '.md'),
    content: matches[2],
  });
};

const readPost = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf-8', (error, str) => {
    if (error) {
      reject(error);
    } else {
      resolve(getPostData(filename, str));
    }
  });
});

const filenames = fs.readdirSync(POST_DIR_PATH);

Promise.all(
  filenames
    .filter(filename => filename !== '.editorconfig')
    .map(filename => readPost(path.join(POST_DIR_PATH, filename)))
)
  .then((posts) => {
    fs.writeFileSync(
      path.resolve(__dirname, 'data/posts.json'),
      JSON.stringify(posts, null, 2)
    );
  });
