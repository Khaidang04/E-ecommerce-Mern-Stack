const mongoose = require('mongoose');
const { Schema } = mongoose;//

const userModel = new Schema({
    username: {
        type: String,// ten nguoi dung
        required: true,//bat buoc
        unique: true, //duy nhat
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    idAdmin: {
        type: Boolean,
        default: false,
    },
    // createAt: Date.now()//
},
{
    timestamps: true,// true: createAt, updateAt
}
);

module.exports = mongoose.model("User", userModel)