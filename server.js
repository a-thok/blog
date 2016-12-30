const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const marked = require('marked');

const server = express();

// server settings
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(compression());
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, 'public/js')));
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

const posts = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf-8')
);

const markPost = (post, slice = false) => {
  const neededSlice = slice && post.content.length > 150;
  const content = neededSlice ? `${post.content.slice(0, 150)}...` : post.content;

  return Object.assign({}, post, {
    content: marked(content, { sanitize: slice }),
  });
};

server.get('/', (req, res) => {
  const PER_PAGE = 10;
  const { p, tag } = req.query;
  const startIndex = p ? PER_PAGE * (p - 1) : 0;
  const result = posts
    .filter(post => !tag || post.tags.includes(tag))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(startIndex, startIndex + PER_PAGE);

  res.render('index', {
    posts: result.map(post => markPost(post, true)),
  });
});

server.get('/post/:name', (req, res) => {
  const { name } = req.params;
  const result = posts.find(post => post.name === name);

  res.render('post', {
    post: markPost(result),
  });
});

server.listen(process.env.PORT || 4000, (err) => {
  if (err) {
    throw err;
  } else {
    /* eslint-disable no-console */
    console.log(`server listening on port ${process.env.PORT || 4000}`);
  }
});
