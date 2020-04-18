// middleware.js
const jwt = require('jsonwebtoken');
var cookies = require("cookie-parser");
const secret = 'mysecretsshhh';
const withAuth = function(req, res, next) {
  console.log("--------------------------------------");
  //parsing for string after 'token= '
  const rawCookie = req.headers.cookie;
  //parsing raw cookie to find jwt token
  var rawCookieParams = rawCookie.split(";");
  var rawCookieNameAndValue = rawCookieParams[1].split("=");
  var token = rawCookieNameAndValue[1];
  console.log("TOKEN IN MIDDLEWARE IS");
  console.log(token);
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;