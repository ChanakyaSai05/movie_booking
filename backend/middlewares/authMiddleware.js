const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // console.log("auth middleware");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("verifiedToken", verifiedToken);

    if (!verifiedToken.userId) {
      return res.status(401).json({ success: false, message: "Token does not contain userId" });
    }

    req.user = verifiedToken; // better than modifying req.body
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ success: false, message: "Token invalid" });
  }
};

module.exports = auth;
