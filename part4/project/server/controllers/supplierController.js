const Supplier = require("../models/Supplier")


const getAllSuppliers = async (req,res) => {
    console.log(req.user)
    const suppliers=await Supplier.find().lean()
    if(!suppliers?.length){
        return res.status(400).json({message: 'No suppliers found'})
    }
    res.json(suppliers)
}

const getSupplierById = async (req, res) => {
    const {_id} = req.params
    const supplier = await Supplier.findById(_id).lean()
    if (!supplier) {
    return res.status(400).json({ message: 'No suppliers found' })
    }
    res.json(supplier)
}
module.exports = {
    getSupplierById,getAllSuppliers
}
