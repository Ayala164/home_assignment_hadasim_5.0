const express = require("express")
const router = express.Router()
const goodsController = require("../controllers/goodsController")
router.get("/:_id", goodsController.getGoodsById)
router.get("/", goodsController.getAllGoods)

module.exports = router