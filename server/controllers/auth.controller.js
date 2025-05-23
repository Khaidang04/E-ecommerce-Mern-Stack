const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    const { password, ...userData } = newUser._doc;
    res.status(200).json({
      message: "Tao tai khoan thanh cong",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi khi tao tai khoan",
      error: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // tim kiem user theo email
    if (!user) {
      return res.status(404).json({
        message: "Khong tim thay tai khoan",
      });
    }

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(404).json({
        message: "Mat khau khong chinh xac",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id, // id cua user
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );
    const { password, ...userData } = user._doc;
    res.status(200).json({
      message: "Dang nhap thanh cong",
      data: { ...userData, token },
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      message: "Loi khi login",
      error: error,
    });
  }
};
module.exports = {
  register,
  login,
};
