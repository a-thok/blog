const path = require('path');
const fs = require('fs');
const csp = require('helmet-csp');

const isDev = process.env.NODE_ENV !== 'production';

const directives = {
  // blockAllMixedContent: true,
  // upgradeInsecureRequests: true,
  defaultSrc: ["'self'"],
  styleSrc: [
    "'self'",
    'fonts.googleapis.com',
    'a.disquscdn.com',
  ],
  scriptSrc: [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    'cdn.polyfill.io',
    'cdn.bootcss.com',
    'atalktome.disqus.com',
    'a.disquscdn.com',
  ],
  imgSrc: [
    "'self'",
    'referrer.disqus.com',
  ],
  fontSrc: [
    "'self'",
    'fonts.gstatic.com',
  ],
  connectSrc: [
    "'self'",
    'ws:',
    'disqus.com/api',
    'links.services.disqus.com/api',
  ],
  frameSrc: [
    "'self'",
    'disqus.com',
  ],
};

if (isDev) {
  directives.styleSrc.push("'unsafe-inline'");
  directives.styleSrc.push('blob:');
}

exports.setCsp = csp({
  directives,
});

exports.setSecurityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  });
  return next();
};

const getData = (filename) => {
  const filePath = path.resolve('db', filename);
  return JSON.parse(fs.readFileSync(filePath));
};
const talks = getData('talks.json');
const posts = getData('posts.json');

exports.getRandomTalk = () => {
  const randomIndex = Math.ceil(Math.random() * talks.length);
  return talks[randomIndex];
};

exports.getPosts = (tag, page) => {
  const PER_PAGE = 5;
  const startIndex = PER_PAGE * (page - 1);
  const endIndex = startIndex + PER_PAGE;

  const postsByTag = posts.filter(post => tag === 'all' || post.tags.includes(tag));

  const postsByPage = postsByTag
    .slice(startIndex, endIndex)
    .map(({ name, title, date }) => ({ name, title, date }));

  return ({
    posts: postsByPage,
    total: postsByTag.length,
  });
};

exports.getPost = name => posts.find(post => post.name === name);
