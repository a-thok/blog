import marked from 'marked';
import Prism from 'prismjs';
import readData from './helpers/readData';
import renderPage from './helpers/renderPage';

const postData = readData('data/posts.json');
const PER_PAGE = 5;


// POST LIST
const readPosts = (page, tag) => {
  const startIndex = PER_PAGE * (+page - 1);
  const endIndex = startIndex + PER_PAGE;

  return postData
    .filter(post => !tag || post.tags.includes(tag))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(startIndex, endIndex)
    .map(({ name, title, date }) => ({ name, title, date }));
};

const calcTotalPages = () => Math.ceil(postData.length / PER_PAGE);

export const getPostList = (req, res) => {
  const { page = 1, tag = '' } = req.query;
  const posts = readPosts(page, tag);

  const state = {
    tag,
    currentPage: +page,
    totalPages: calcTotalPages(),
    posts,
  };

  if (req.query.json) {
    return res.status(200).send({
      success: true,
      result: state,
    });
  }

  res.locals.title = 'Blog - A Talk To Me';
  return renderPage(req, res, state);
};


// POST
marked.setOptions({
  highlight(code, lang) {
    return Prism.highlight(code, Prism.languages[lang]);
  },
});

const markPostContent = ({ content, ...others }) => ({
  ...others,
  content: marked(content).replace(
    /<pre><code class="lang-(\w+)">/g,
    '<pre class="language-$1" data-lang="$1"><code class="language-$1">'
  ),
});

const readPost = name => postData.find(post => post.name === name);

export const getPost = (req, res) => {
  const { name } = req.params;
  const post = readPost(name);
  const state = {
    post: markPostContent(post),
  };

  if (req.query.json) {
    return res.status(200).send({
      success: true,
      result: state,
    });
  }

  res.locals.title = post.title;
  return renderPage(req, res, state);
};
