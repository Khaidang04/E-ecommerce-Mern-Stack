const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,//
    api_key: process.env.CLOUD_API_KEY,// khoi tao cloudinary
    api_secret: process.env.CLOUD_API_SECRET,//
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,// Khai báo cloudinary
    params: {// Tham số truyền vào
        folder: "commerce-shop",
        resource_type: "image",// loại tài nguyên
        public_id: (req, file) => "computed-filename-using-request",
    }
})

const parser = multer({storage: storage})// Tạo một parser multer với storage là CloudinaryStorage

module.exports = {
    cloudinary,
    storage,
    parser
}