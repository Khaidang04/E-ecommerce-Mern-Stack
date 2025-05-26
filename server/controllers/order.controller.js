const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

const placeOrder = async (req, res) => {
  try {
    console.log("req.user:", req.user); // kiểm tra thông tin user từ token

    // 1. Xac dinh userId tu request
    const userId = req.user.userId; // id cua user tu JWT
    const username = req.user.username; // ten cua user tu JWT

    //Lay gio hang cua user tu CSDL
    const cart = await Cart.findOne({ userId: userId }); //

    // 2. Neu gio hang khong ton tai
    if (!cart) {
      return res.status(404).json({
        message: "Gio hang khong ton tai",
      });
    }

    // 3. Tinh toan tong so luong san pham trong gio hang
    let totalAmount = 0; // Khoi tao bien tong so luong san pham

    //duyet mang cart.products lay ra tung san pham trong gio hang
    for (let item of cart.products) {
      //
      // Lay danh sach san pham trong gio hang
      const product = await Product.findById(item.productId);
      if (!product) continue; // Neu san pham khong ton tai, bo qua

      totalAmount += product.price * item.quantity; // Tinh toan tong so luong san pham

      // 3.1. Kiem tra so luong san pham co du trong kho khong(neu can)
      if (product.stock && product.stock >= item.quantity) {
        {
          // Neu so luong san pham du trong kho
          product.stock -= item.quantity; // Giam so luong san pham trong kho
          await product.save();
        }
      }
    }
    // 4. Tao don hang moi
    const newOrder = new Order({
      userId: userId,
      username: username,
      products: cart.products,
      amount: totalAmount,
      address: req.body.address,
      status: "pending",
    });
    const savedOrder = await newOrder.save();

    // 5. Xoa gio hang sau khi dat hang thanh cong
    await Cart.findByIdAndDelete(cart._id);
    // await Cart.findOneAndDelete({ userId });

    res.status(200).json({
      message: "Dat hang thanh cong",
      data: savedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi khi dat hang",
      error: error.message,
    });
  }
};

// const createOrder = async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.status(200).json({
//       message: "Dat hang thanh cong",
//       data: newOrder,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Dat hang khong thanh cong",
//       error: error.message,
//     });
//   }
// };

const updateOrder = async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "Cap nhap don hang thanh cong",
      data: updateOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi khi cap nhat don hang",
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Xoa don hang thanh cong",
      data: deleteOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi khi xoa gio hang",
      error: error.message,
    });
  }
};

const getUserOrder = async (req, res) => {
  try {
    const Order = await Order.findOne({ userId: req.params.id });
    res.status(200).json({
      message: "Lay don hang thanh cong",
      data: Order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi khi lay don hang",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json({
      message: "Lay danh sach don hang thanh cong",
      data: Orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi khi lay danh sach don hang",
      error: error.message,
    });
  }
};

const getMonthlyIncome = async (req, res) => {
  try {
    const date = new Date(); // Thay đổi ngày tháng năm ở đây
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1)); //
    const prevMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
    const startOfYear = new Date(new Date().getFullYear() - 1);
    const getMonthlyIncome = await Order.aggregate([
      {
        // $match: {createdAt: {$gte: prevMonth}}// Lọc các đơn hàng được tạo trong tháng trước
        $match: { createdAt: { $gte: startOfYear } },
      },
      {
        $project: {
          month: { $month: "$createdAt" }, // Lấy tháng của đơn hàng
          sales: "$amount", // Lấy số tiền của đơn hàng
        },
      },
      {
        $group: {
          _id: "$month", // Nhóm theo tháng
          total: { $sum: "$sales" }, // Tính tổng số tiền của các đơn hàng trong tháng
        },
      },
    ]);
    res.status(200).json({
      message: "Lay thu nhap hang thang thanh cong",
      data: getMonthlyIncome,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Loi khi lay thu nhap hang thang",
      error: error.message,
    });
  }
};
module.exports = {
  placeOrder,
  //   createOrder,
  //   createOrder,
  updateOrder,
  deleteOrder,
  getUserOrder,
  getOrders,
  getMonthlyIncome,
};
