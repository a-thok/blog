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
