const jwt = require("jsonwebtoken");

 const userVerify = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  

  if (!token) {
    return res.status(403).json({ message: "No token provided, access denied." });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  });
};



module.exports = userVerify

