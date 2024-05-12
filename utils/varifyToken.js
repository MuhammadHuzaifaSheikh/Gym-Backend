
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { createError } = require('./error');

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return next(createError(401, 'You are not authenticated!'));
  }
  jwt.verify(token, process.env.jwtName, (error, user) => {
    if (error) {
      return next(createError(401, 'Token is not valid'));
    }
    req.user = user;
    next();
  });
};

// export const verifyUser = (req, res, next) => {
//     verifyToken(req, res, next, () => {
//       if (req.user.id === req.params.id || req.user.isAdmin) {
//         next();
//       } else {
//         return next(createError(403, "You are not authorized!"));
//       }
//     });
//   };

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

module.exports = { verifyToken, verifyAdmin }