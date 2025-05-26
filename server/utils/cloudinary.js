const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Khởi tạo cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Kiểm tra kết nối Cloudinary
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("Lỗi kết nối Cloudinary:", error);
    throw new Error("Không thể kết nối đến Cloudinary");
  }
  console.log("Kết nối Cloudinary thành công:", result);
});

// Cấu hình CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.split(".").slice(0, -1).join(".");
    return {
      folder: "commerce-shop",
      resource_type: "image",
      public_id: `${timestamp}-${originalName}`,
      format: "jpg",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
      ],
    };
  },
});

// Cấu hình multer với giới hạn kích thước file (tối đa 5MB)
const parser = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Chỉ chấp nhận các định dạng JPEG, PNG hoặc GIF"),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = { cloudinary, storage, parser };
