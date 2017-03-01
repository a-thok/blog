import readData from './helpers/readData';
import renderPage from './helpers/renderPage';

const sentenceData = readData('data/sentences.json');

const readSentence = () => {
  const randomIndex = Math.ceil(Math.random() * sentenceData.length);
  return sentenceData[randomIndex];
};

export const getSentence = (req, res) => {
  const sentence = readSentence();

  const state = { sentence };

  res.header('Cache-Control', 'no-cache');

  if (req.query.json) {
    return res.status(200).send({
      success: true,
      result: state,
    });
  }

  res.locals.title = 'A Talk To Me';
  return renderPage(req, res, state);
};
