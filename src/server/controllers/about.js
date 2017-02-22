import renderPage from './helpers/renderPage';

export const getAbout = (req, res) => {
  res.locals.title = 'About - A Talk To Me';
  return renderPage(req, res);
};
