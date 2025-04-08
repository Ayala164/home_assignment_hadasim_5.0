const mongoose = require('mongoose')
const supplierSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    phone: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    agentName: {
        type: String,
        required: true,
    },
    goodsList:{
        type:[{ type: mongoose.ObjectId, ref: 'Goods' }],
        required: true,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('Supplier', supplierSchema)