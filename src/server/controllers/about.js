import renderPage from './helpers/renderPage';

export const getAbout = (req, res) => {
  res.locals.title = 'About Me - A Talk To Me';
  return renderPage(req, res);
};
