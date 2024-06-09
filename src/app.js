import express, { urlencoded }  from "express"
import cors  from 'cors'


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:'16kb'}))
app.use(urlencoded({extended:true, limit:'16kb'}))
app.use(express.static('public'))


 //routes import

import userRouter from "./routes/user.routes.js"
import categoryRouter from "./routes/category.routes.js"
import questionRouter from "./routes/question.routes.js"

//routes declarations

app.use('/api/users', userRouter)
app.use('/api/categories', categoryRouter);
app.use('/api/questions', questionRouter);


export {app}
