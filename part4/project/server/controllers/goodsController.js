const Goods = require("../models/Goods");

const createGoods = async (productName,cost,minAmount) => {
    if (!cost||!productName||!minAmount) {
        return res={
            status:400,
            message: 'fields are required'
        }
        // return res.status(400).json({ message: 'fields are required' })
    }
    // const ifName=await Cost.findOne({name:name})
    // if (ifName)
    //     return res.status(400).json({ message: 'name already exist' })

    const newGoods = await Goods.create({ minAmount, productName, cost})
    // const goodses = await Goods.find().lean()
    if (newGoods) { // Created
        return res={
            status:201,
            message: 'New Goods created',
            newGoods:newGoods
        }
        // return res.status(201).json({ message: 'New Goods created',
        //     // goodses:goodses.
        //     newGoods
        //  })
    } else {
        return res={
            status:400,
            message: 'Invalid Goods '
        }
        // return res.status(400).json({ message: 'Invalid Goods ' })
    }
}
const getAllGoods = async (req,res) => {
    console.log(req.user)
    const goodsses=await Goods.find().lean()
    if(!goodsses?.length){
        return res.status(400).json({message: 'No goodsses found'})
    }
    res.json(goodsses)
}

const getGoodsById = async (req, res) => {
    const {_id} = req.params
    const goods = await Goods.findById(_id).lean()
    if (!goods) {
        return res.status(400).json({ message: 'No goodsses found' })
    }
    res.json(goods)
}
const getGoodsByID = async (_id) => {
    const goods = await Goods.findById(_id).lean()
    if (!goods) {
    return ans={
        status:400,
        message: 'No goodsses found' 
    }
    }
   return ans={
    status:200,
        goods
    }
}
module.exports = {
    createGoods,getGoodsById,getAllGoods,getGoodsByID
}