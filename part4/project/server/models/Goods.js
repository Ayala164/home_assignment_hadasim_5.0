const mongoose = require("mongoose")
const Schema = mongoose.Schema
const goodsSchema = new Schema({
    productName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }, 
    cost: {
        type: String,
        required: true
    },
    minAmount: {
        type: mongoose.Schema.Types.Int32,
        required: true
    },
}, { timestamps: true })
module.exports = mongoose.model("Goods", goodsSchema)