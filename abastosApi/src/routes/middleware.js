const jwt = require("jwt-simple");
const moment = require("moment")
//TOKEN
const checkToken = (req, res, next) => {
  
  if (!req.headers['user-token']) {
    return res.json({ error: "Falta Token" });
  }

  const userToken = req.headers["user-token"];
  let payload = {};
  // res.send(req.headers['user-token']);

  try {
    payload = jwt.decode(userToken, "Token256");
  } catch (error) {
    return res.json({ error: "Token incorrecto" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.json({
      error: "El token ha expirado tiene que volver a loguearte",
    });
  }
  next();
};

module.exports = { checkToken };