const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const dbConnect = mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

module.exports = {dbConnect}