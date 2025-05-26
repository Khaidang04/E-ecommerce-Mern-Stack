const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: "majority",
    });
    console.log("Kết nối database thành công tại", new Date().toLocaleString());
  } catch (err) {
    console.error("Lỗi kết nối database:", err.message);
    throw new Error("Database connection failed: " + err.message);
  }
};

module.exports = dbConnect;
