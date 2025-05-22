const Product = require('../models/product.model');

const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save()
        res.status(200).json({
            message: "Tao san pham thanh cong",
            data: newProduct
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Loi khi tao san pham",
            error: error.message
        })
    }
}
module.exports = {
    createProduct
}