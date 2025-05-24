const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // Không mã hóa ở đây
    });

    await newUser.save(); // middleware pre('save') sẽ tự mã hóa

    const { password, ...userData } = newUser._doc;
    res.status(200).json({
      message: "Tạo tài khoản thành công",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi tạo tài khoản",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    const isMatch = await user.matchPassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...userData } = user._doc;
    res.status(200).json({
      message: "Đăng nhập thành công",
      data: { ...userData, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi đăng nhập",
      error,
    });
  }
};

module.exports = {
  register,
  login,
};
