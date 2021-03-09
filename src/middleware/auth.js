const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async function (req, res, next) {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log(token)
        const decoded = await jwt.verify(token, process.env.JWTTOKEN)
        // console.log("HEre"+decoded)
        const user = await User.findOne({
            _id: decoded,
            'tokens.token': token
        })
        if (!user) {
            throw new Error();
        }
        req.token = token
        req.user = user

        next();
    } catch (e) {
        res.status(401).json({
            status: 'Authenticate User'
        })
    }

}
module.exports = auth