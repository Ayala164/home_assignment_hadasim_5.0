const masterMW = (req, res, next) => {
    const role=req.user.roles.find(r=>r==="Master")
    if(!role){
        return res.status(401).json({ message: 'master Unauthorized' })
    }
    next()
}
module.exports = masterMW