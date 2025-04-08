require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const verifyJWT = require("./middleware/verifyJWT")
// const masterMW = require("./middleware/masterMW")

const app = express()
const PORT = process.env.PORT || 7000
connectDB()


app.use(cors(corsOptions))
app.use(express.json())


app.get("/", (req, res) => { res.send("This is home page") })
app.use("/auth", require("./routes/authRouter"))

app.use(verifyJWT)

app.use("/supplier", require("./routes/supplierRouter"))
app.use("/goods", require("./routes/goodsRouter"))
app.use("/order", require("./routes/orderRouter"))
// app.use("/customer", require("./routes/customerRouter"))


// app.use(masterMW)

// app.use("/cost", require("./routes/costRouter"))
// app.use("/constraint", require("./routes/constraintRouter"))


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
    ${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})