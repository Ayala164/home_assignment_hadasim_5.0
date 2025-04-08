const express = require("express")
const router = express.Router()
const app = express()
const supplierController = require("../controllers/supplierController")
const masterMW = require("../middleware/masterMW")
router.get("/:_id", supplierController.getSupplierById)
// app.use(masterMW)
router.get("/", supplierController.getAllSuppliers)
module.exports = router
