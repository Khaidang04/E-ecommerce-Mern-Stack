const User = require("../models/user.model");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ msg: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin người dùng:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ msg: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin người dùng:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.updatedUser = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.avatar = req.file.path;
    }
    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({ msg: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ msg: "Cập nhật thông tin thành công", data: user });
  } catch (err) {
    console.error("Lỗi khi cập nhật người dùng:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ msg: "Xóa người dùng thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa người dùng:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json({ data: users });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: { $sum: { $cond: ["$isVerified", 1, 0] } },
          adminUsers: { $sum: { $cond: ["$isAdmin", 1, 0] } },
        },
      },
    ]);
    res.status(200).json({ data: stats[0] });
  } catch (err) {
    console.error("Lỗi khi lấy thống kê người dùng:", err);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
};
