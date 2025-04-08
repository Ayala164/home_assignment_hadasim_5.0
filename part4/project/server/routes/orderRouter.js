const express = require("express")
const router = express.Router()
const app = express()
const orderController = require("../controllers/orderController")
const masterMW = require("../middleware/masterMW")
router.post("/",orderController.createOrder)
// router.get("/:_id", orderController.getOrdersById)
router.put("/", orderController.updateOrderStatus)
router.get("/user",orderController.getUserOrders)

app.use(masterMW)
router.get("/",orderController.getAllOrders)
module.exports = router
