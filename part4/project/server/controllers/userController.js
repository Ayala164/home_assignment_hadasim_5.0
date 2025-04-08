const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// const updateUserOrdersList = async (reqUser,newOrderId) => {
//     // console.log(reqUser)
//     if (!reqUser._id||!newOrderId) {
//         return res={
//             status:400,
//             message: 'fields are required'
//         }
//     }
//     const user = await User.findById(reqUser._id).exec()
//     console.log(reqUser.ordersList)
//     reqUser.ordersList.push(newOrderId)
//     // user.ordersList=[...reqUser.ordersList]
//     console.log(reqUser.ordersList)
//     // user.username=reqUser.username
//     // user.active=reqUser.active
//     // user.roles=[...reqUser.roles]
//     // const hashedPwd = await bcrypt.hash(reqUser.password, 10)
//     // user.password = hashedPwd
//     // console.log(user.ordersList)
//     const updateUser = await user.save()
//     console.log(updateUser)
//     const userInfo = {
//         _id: updateUser._id, ordersList:updateUser.ordersList,
//         roles: updateUser.roles, username: updateUser.username
//     }
//     const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
//     // res.json({ accessToken: accessToken ,userInfo})

//     if (updateUser) { 
//         return res={
//             status:200,
//             message: `update user ${reqUser._id}`,
//             accessToken,
//             userInfo
//         }
  
//     } else {
//         return res={
//             status:400,
//             message: 'Invalid Goods '
//         }
//     }
// }

const updateUserOrdersList = async (reqUser, newOrderIds) => {
    if (!reqUser._id || !newOrderIds || !Array.isArray(newOrderIds)) {
        return {
            status: 400,
            message: 'fields are required'
        };
    }

    const user = await User.findById(reqUser._id).exec();

    if (!user) {
        return {
            status: 404,
            message: 'User not found'
        };
    }
    user.ordersList = [...user.ordersList, ...newOrderIds];

    const updatedUser = await user.save();

    if (updatedUser) {
        const userInfo = {
            _id: updatedUser._id,
            ordersList: updatedUser.ordersList,
            roles: updatedUser.roles,
            username: updatedUser.username
        };
        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
        return {
            status: 200,
            accessToken,
            userInfo
        };
    } else {
        return {
            status: 400,
            message: 'Failed to update user orders list'
        };
    }
};




module.exports = {
    updateUserOrdersList
}