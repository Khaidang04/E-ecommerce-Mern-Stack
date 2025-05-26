const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ msg: "Truy cập bị từ chối" });

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    res.status(400).json({ msg: "Mã không hợp lệ" });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ msg: "Bạn không có quyền truy cập" });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
