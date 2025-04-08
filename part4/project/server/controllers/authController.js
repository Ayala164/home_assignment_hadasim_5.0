const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require("../models/User")
const Supplier = require("../models/Supplier")
const Goods = require("../models/Goods")
const {createGoods} = require("./goodsController")

const login = async (req, res) => {
    const { companyName, password } = req.body
    username=companyName
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const foundUser = await User.findOne({ username }).lean()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    const userInfo = {
        _id: foundUser._id, ordersList:foundUser.ordersList,
        roles: foundUser.roles, username: foundUser.username
    }
    if (foundUser.roles.find(r => r === "Supplier")) {

        const foundSupplier = await Supplier.findOne({ user: foundUser._id })
        if (!foundSupplier) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        userInfo.Supplier = {
            phone: foundSupplier.phone,
            goodsList: [...foundSupplier.goodsList]
        }
    }
    if (foundUser.roles.find(r => r === "Master")) {

    }

    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken ,userInfo})

}
const registerSupplier = async (req, res) => {
    const {  password, phone,goodsList,agentName,companyName} = req.body
    if (  !password || !goodsList || !phone || !agentName || !companyName ) {// Confirm data
        return res.status(400).json({ message: 'All fields are required' })
    }
    username=companyName
    const duplicate = await User.findOne({ username }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate companyName" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const ordersList = []
    const userObject = { username:companyName, active: true, password: hashedPwd, roles: "Supplier", ordersList}
    const user = await User.create(userObject)

    if (!user) {
        return res.status(400).json({ message: 'Invalid user received' })

    }
    const linkGoodsList = [];

    for (const goods of goodsList) {
        const res = await createGoods(goods.productName, goods.cost, goods.minAmount);
        if (res.status === 201) {
            linkGoodsList.push(res.newGoods._id);
        }
    }
    
    const supplierObject = { user:user._id, phone,goodsList:linkGoodsList,agentName,companyName  }
    const supplier = await Supplier.create(supplierObject)
    if (!supplier) {
        return res.status(400).json({ message: "Invalid supplier received" })
    }
    console.log(supplier.goodsList)
    const suppliers = await Supplier.find().lean()
    return res.status(201).json({
        message: `New user type supplier ${user.username}created`,
        suppliers
    })
}
const registerMaster = async (req, res) => {
    const {  password, username} = req.body
    if (  !password || !username) {// Confirm data
        return res.status(400).json({ message: 'All fields are required' })
    }
    if(!(username===process.env.MASTER_USERNAME && password===process.env.MASTER_PASSWORD)){
        return res.status(401).json({ message: 'Unauthorized Master' })
    }
    const duplicate = await User.findOne({ username }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const ordersList = []
    const userObject = { username, active: true, password: hashedPwd, roles: "Master", ordersList}
    const user = await User.create(userObject)

    if (!user) {
        return res.status(400).json({ message: 'Invalid user received' })

    }
}
module.exports = { login, registerSupplier,registerMaster}
