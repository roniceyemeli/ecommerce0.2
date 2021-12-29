const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Invalid Authentification" });

    jwt.verify(token, process.env.TOKEN_ACCESS, (err, user) => {
      if (err) return res.status(400).json({ msg: "invalid Authentification" });

      req.user = user
      next()
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = auth;