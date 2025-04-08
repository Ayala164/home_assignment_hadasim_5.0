const Order = require("../models/Order");
const { getGoodsByID } = require("./goodsController")
const { updateUserOrdersList } = require("./userController")
const Supplier = require("../models/Supplier");
const User = require("../models/User");

const createOrder = async (req, res) => {
    const { supplier, goods, date } = req.body;
    console.log("Received order data:", { supplier, goods, date })

    if (!supplier || !goods || !date || !Array.isArray(goods)) {
        return res.status(400).json({ message: 'fields are required or goods should be an array' });
    }

    const orders = [];
    const responses = [];

    for (const item of goods) {
        if (!item.amount) {
            return res.status(400).json({ message: 'fields are required no amount' });
        }
        const ans = await getGoodsByID(item.productId);
        console.log("Goods found:", ans);

        if (!(ans.status === 200)) {
            return res.status(400).json({ message: 'fitted goods unfound' });
        }
        // console.log(ans.goods.minAmount)
        if (item.amount < ans.goods.minAmount) {
            return res.status(404).json({ message: 'forbbiden amount' });
        }
        const newOrder = await Order.create({ supplier, goods: item.productId, date, status: "exist", amount: item.amount })
        console.log(newOrder)

        if (newOrder) {
            orders.push(newOrder);
            responses.push(newOrder._id);
        } else {
            console.log("Failed to create order for product:", item.productId);
        }
    }

    if (orders.length > 0) {
        const answer = await updateUserOrdersList(req.user, responses);
        const orderSupplier = await Supplier.findById(supplier).lean()
        if (!orderSupplier) {
            return res.status(400).json({ message: 'order not added to supplier orderslist' })
        }
        const result = await updateUserOrdersList(orderSupplier.user, responses);
        if (answer.status === 200) {
            return res.status(201).json({
                message: 'New orders created',
                orders,
                accessToken: answer.accessToken,
                userInfo: answer.userInfo
            });
        } else {
            return res.status(400).json({ message: 'orders not added' });
        }
    } else {
        return res.status(400).json({ message: 'No valid orders created' });
    }
};

const getAllOrders = async (req, res) => {
    console.log(req.user)
    const orders = await Order.find().lean()
    if (!orders?.length) {
        return res.status(400).json({ message: 'No orders found' })
    }
    res.json(orders)
}

const getOrdersById = async (req, res) => {
    const { _id } = req.params
    const order = await Order.findById(_id).lean()
    if (!order) {
        return res.status(400).json({ message: 'No orders found' })
    }
    res.json(order)
}
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id
        if (req.user.roles[0] === "Master") {
            const orders = await Order.find().lean()
            if (!orders) {
                return res.status(400).json({ message: 'No orders found' })
            }
            res.json(orders)
        }
        const supplier = await Supplier.find({ user: userId }).lean()
        const orders = await Order.find({ supplier: supplier[0]._id }).lean();
        console.log(orders)
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        return res.json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { _id, status } = req.body
        if (req.user.roles[0] === "Master" && status != "process") {
            return res.status(404).json({ message: "you cant change status" })
        }
        if (req.user.roles[0] === "Supplier" && status != "exist") {
            return res.status(404).json({ message: "you cant change status" })
        }
        const order = await Order.findById(_id)
        console.log(_id, status)

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (req.user.roles[0] === "Master") {
            order.status = "completed"
        }
        if (req.user.roles[0] === "Supplier") {
            order.status = "process"
        }
        await order.save();
        return res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    createOrder, getOrdersById, getAllOrders, getUserOrders,
    updateOrderStatus,
}