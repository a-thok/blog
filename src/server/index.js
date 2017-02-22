import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import * as helpers from './helpers';
import * as controllers from './controllers';

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(compression());
server.use(express.static(path.join(process.cwd(), './public')));
server.use(express.static(path.join(process.cwd(), './dist')));

server.use(helpers.setSecurityHeaders);
server.use(helpers.sniffIE);

server.get('/', controllers.getSentence);
server.get('/blog', controllers.getPostList);
server.get('/blog/:name', controllers.getPost);
server.get('/about', controllers.getAbout);

server.listen(process.env.PORT || 4000, (err) => {
  if (err) {
    throw err;
  } else {
    /* eslint-disable no-console */
    console.log(`server listening on port ${process.env.PORT || 4000}`);
  }
});
