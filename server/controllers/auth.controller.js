const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");

// Đăng ký
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email đã tồn tại" });

    user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "Username đã tồn tại" });

    const userData = { username, email, password };
    if (req.file) {
      userData.avatar = req.file.path;
    }

    user = new User(userData);
    await user.save();

    res.json({ msg: "Đăng ký thành công, bạn có thể đăng nhập ngay" });
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email không tồn tại" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ msg: "Mật khẩu không chính xác" });

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    const { password: _, refreshToken: __, ...userData } = user._doc;
    res.status(200).json({
      message: "Đăng nhập thành công",
      data: userData,
    });
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

// Gia hạn Access Token
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ msg: "Refresh Token không tồn tại" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        msg: "Refresh Token không hợp lệ hoặc không tìm thấy người dùng",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_KEY,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.status(200).json({ message: "Access Token đã được gia hạn" });
  } catch (error) {
    console.error("Lỗi khi gia hạn token:", error);
    res.status(403).json({ msg: "Refresh Token không hợp lệ" });
  }
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email không tồn tại" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendEmail(
      email,
      "Đặt lại Mật khẩu",
      `Nhấn vào liên kết để đặt lại mật khẩu: ${resetLink}`
    );

    res.json({ msg: "Liên kết đặt lại mật khẩu đã được gửi" });
  } catch (err) {
    console.error("Lỗi khi gửi email đặt lại mật khẩu:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

// Xác thực token đặt lại mật khẩu
exports.verifyResetPasswordToken = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Liên kết không hợp lệ hoặc đã hết hạn" });
    }
    res.status(200).json({ msg: "Token hợp lệ" });
  } catch (err) {
    console.error("Lỗi khi xác thực token:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Liên kết không hợp lệ hoặc đã hết hạn" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Mật khẩu đã được đặt lại" });
  } catch (err) {
    console.error("Lỗi khi đặt lại mật khẩu:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ msg: "Đăng xuất thành công" });
};
