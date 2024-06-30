const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (err) {
    res.status(401).json({ err });
  }
};
