const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const { markPost, handleRequest } = require('./utils');

const sentenceData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/sentences.json'), 'utf-8')
);
const postData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/posts.json'), 'utf-8')
);

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(compression());
server.use(express.static(path.join(process.cwd(), './public')));
server.use(express.static(path.join(process.cwd(), './dist')));

server.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  });
  return next();
});

server.use((req, res, next) => {
  req.isIE = req.headers['user-agent'].includes('Trident');
  next();
});

server.get('/', (req, res) => {
  const randomIndex = Math.ceil(Math.random() * sentenceData.length);
  const sentence = sentenceData[randomIndex];
  handleRequest(req, res, 'A Talk To Me', { sentence });
});

server.get('/blog', (req, res) => {
  const { page = 1, tag = '' } = req.query;
  const PER_PAGE = 5;
  const startIndex = PER_PAGE * (+page - 1);
  const posts = postData
    .filter(post => !tag || post.tags.includes(tag))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(startIndex, startIndex + PER_PAGE)
    .map(post => ({
      ...post,
      content: null,
    }));

  return handleRequest(req, res, 'Blog - A Talk To Me', {
    currentPage: +page,
    totalPages: Math.ceil(postData.length / 5),
    tag,
    posts,
  });
});

server.get('/blog/:name', (req, res) => {
  const { name } = req.params;
  const post = markPost(
    postData.find(postItem => postItem.name === name)
  );

  return handleRequest(req, res, post.title, { post });
});

server.get('/about', (req, res) => handleRequest(req, res, 'About - A Talk To Me', {}));

server.listen(process.env.PORT || 4000, (err) => {
  if (err) {
    throw err;
  } else {
    /* eslint-disable no-console */
    console.log(`server listening on port ${process.env.PORT || 4000}`);
  }
});
