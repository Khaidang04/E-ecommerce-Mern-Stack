const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Kiểm tra xem mã thông báo có trong tiêu đề yêu cầu không
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Nếu không có mã thông báo, trả về lỗi 401
  if (!token) return res.status(401).send("Truy cap bi tu choi"); // Nếu có mã thông báo, xác thực nó

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified; // Nếu mã thông báo hợp lệ, tiếp tục với yêu cầu
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Ma khong hop le"); // Nếu mã thông báo không hợp lệ, trả về lỗi 400
  }
};

const verifyAdmin = (req, res, next) => {
  // Kiểm tra xem người dùng có phải là quản trị viên không
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      // Nếu người dùng là quản trị viên, tiếp tục với yêu cầu
      next();
    } else
      (error) => {
        console.log(error);
        res.status(403).send("Ban khong co quyen truy cap"); // Nếu không phải là quản trị viên, trả về lỗi 403
      };
  });
};

module.exports = { verifyToken, verifyAdmin };
