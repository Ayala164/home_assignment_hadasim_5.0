const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
router.post("/login", authController.login)
router.post("/registerSupplier", authController.registerSupplier)
router.post("/registerMaster", authController.registerMaster)

module.exports = router