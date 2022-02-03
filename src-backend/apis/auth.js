/*
AUTH MIDDLEWARE
*/

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.body.token;
  if (!token) token = req.header("x-auth-token");
  if (!token)
    return res.send({ error: { code: -1, message: "Token inválido" } });
  try {
    const payload = jwt.verify(token, process.env.APP_KEY);
    const now = new Date().getTime();
    if (payload.expires < now)
      return res.send({ error: { code: 1001, message: "expired token" } });
    req.user = payload;
    next();
  } catch (error) {
    return res.send({ error: { code: error.code, message: error.message } });
  }
};
