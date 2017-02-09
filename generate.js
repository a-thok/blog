const fs = require('fs');
const path = require('path');

const POST_DIR_PATH = path.join(__dirname, 'posts');

const getPostData = (filename, postStr) => {
  const matches = postStr.match(/%TITLE\s*(.*)\s*%DATE(.*)\s*%TAGS\s*(.*)\s*([\s\S]*)/);
  return {
    name: path.basename(filename, '.md'),
    title: matches[1],
    date: matches[2],
    tags: matches[3].split(','),
    content: matches[4],
  };
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
      path.resolve(__dirname, 'posts.json'),
      JSON.stringify(posts, null, 2)
    );
  });
