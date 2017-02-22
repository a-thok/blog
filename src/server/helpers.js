const uuid = require('uuid');
const csp = require('helmet-csp');

const isDev = process.env.NODE_ENV !== 'production';

const directives = {
  blockAllMixedContent: true,
  upgradeInsecureRequests: true,
  defaultSrc: ["'self'"],
  styleSrc: [
    "'self'",
    'fonts.googleapis.com',
    'a.disquscdn.com',
  ],
  scriptSrc: [
    "'self'",
    'cdn.polyfill.io',
    'cdn.bootcss.com',
    'atalktome.disqus.com',
    'a.disquscdn.com',
    (req, res) => `'nonce-${res.locals.nonce}'`,
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
  directives.styleSrc.push('blob:');
  directives.scriptSrc.push("'unsafe-eval'");
}

export const setNonce = (req, res, next) => {
  res.locals.nonce = uuid.v4();
  return next();
};

export const setCsp = csp({
  directives,
  reportOnly: isDev,
});

export const setSecurityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  });
  return next();
};

export const sniffIE = (req, res, next) => {
  res.locals.isIE = req.headers['user-agent'].includes('Trident');
  return next();
};
