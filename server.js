const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helpers = require('./helpers');

const server = express();
const DIST_PATH = path.resolve('dist');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(compression());
server.use(helpers.setSecurityHeaders);
server.use(express.static(DIST_PATH, { extensions: ['html'] }));
server.use(express.static(path.resolve('public')));

// static routes
server.get('/blog', (req, res) => {
  const { tag = '', page = 1 } = req.query;
  const filename = `blog-${tag || 'all'}-${page}.html`;
  res.sendFile(filename, { root: DIST_PATH });
});

server.get('/blog/:name', (req, res) => {
  res.sendFile(`${req.params.name}.html`, { root: DIST_PATH });
});

// json routes
server.get('/json/blog', (req, res) => {
  const { tag = '', page = 1 } = req.query;

  const { posts, pages } = helpers.getPosts(tag, +page);

  res.status(200).send({
    success: true,
    result: {
      posts,
      tag,
      pages,
      page: +page,
    },
  });
});

server.get('/json/blog/:name', (req, res) => {
  const post = helpers.getPost(req.params.name);

  res.status(200).send({
    success: true,
    result: { post },
  });
});

server.get('/json/sentence', (req, res) => {
  const sentence = helpers.getRandomSentence();

  res.header('Cache-Control', 'no-cache');
  return res.status(200).send({
    success: true,
    result: { sentence },
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
