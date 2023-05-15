var jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (token) {
    const decoded = await jwt.verify(token, process.env.key);
    if (decoded) {
      const userId = decoded.userId;
      req.userDetails = decoded;
      console.log("decoded",decoded);
      req.body.userId = userId;
      console.log(req.body);
      next();
    } else {
      res.send({ msg: "please login" });
    }
  } else {
    res.send({ msg: "please login" });
  }
};

module.exports = {
  auth,
};
