const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (!token) {
    return res.json({
      success: true,
      isAuthenticate: false,
      message: "You are not authenticated!"
    });
  }

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  } catch (err) {
    return res.json({
      success: false,
      isAuthenticate: false,
      message: "Token is not valid!",
      error: err.message
    });
  }
};

module.exports = verifyToken;
