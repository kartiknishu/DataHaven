const jwt = require('jsonwebtoken')

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // console.log("BACKEND TOKEN : ", token)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, email } = decoded
        req.user = { id, email }
        next()
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    
}

module.exports = {authenticationMiddleware}