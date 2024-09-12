const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const {dbConnect} = require('./config/db.js')
const userRouter = require('./routes/User.js')
const resourceRouter = require('./routes/Resource.js')
const commentRouter = require('./routes/comment.js')
const coursesRouter = require('./routes/courses.js')
const notFound = require('./middleware/notFound.js')

dotenv.config()

const app = express()
app.use(express.json())
// app.use(cors())
const origin = process.env.NODE_ENV === "development"
  ? "http://localhost:3000"
  : process.env.FRONTEND_URL;


app.use(
    cors({
      credentials: true,
      exposedHeaders: ["set-cookie","ajax_redirect"],
      preflightContinue: true,
      origin
    }),
);


app.get('/api',(req,res) => {
    res.send('HomePage')
})

app.use('/api/v1/user',userRouter)
app.use('/api/v1/resource',resourceRouter)
app.use('/api/v1/comment',commentRouter)
app.use('/api/v1/courses',coursesRouter)
app.use(notFound)


PORT = process.env.PORT || 5001

app.listen(PORT, async () => {
    try {
        await dbConnect
        console.log("Connected to DB!")
    }
    catch(error) {
        console.log("Error in connecting to DB!")
        console.log(error)
    }
    console.log(`Server is running on port ${PORT}`)
})
