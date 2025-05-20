const mongoose = require('mongoose');
const { Schema } = mongoose;//

const orderModel = new Schema({
    userId: {
        // type: mongoose.Schema.Types.ObjectId,// id cua user
        // ref: "User",// tham chieu den user
        type: String,
        required: true,//bat buoc
    },
    product: [ // danh sach san pham
        {
            productId: {
                type: String,
            },
            quanlity: {
                type: Number,// so luong
                default: 1,// mac dinh la 1
            },
        }
    ],
    amount: {// tong so luong
        type: Number,
        required: true,// bat buoc
        default: 0,
    },
    address: {// dia chi
        type: Object,
        required: true,// bat buoc
    },
    status: {// trang thai
        type: String,
        default: "Pending",// mac dinh la chua giai quyet
    },
    
},
{
    timestamps: true,// true: createAt, updateAt
}
);

module.exports = mongoose.model("Order", orderModel)