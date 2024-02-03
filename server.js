import express from "express"
import dotenv from "dotenv"
import bootcampRoutes from "./routes/bootcampsRoutes.js"
import courseRoutes from './routes/courseRoute.js'


import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from "./config/db.js"
dotenv.config()
import colors from 
"colors"
connectDB()
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1/bootcamps",bootcampRoutes)
app.use('/api/v1/courses', courseRoutes)

app.use(notFound)
app.use(errorHandler)
app.listen(port,()=> console.log(`The server running at port ${port}`.yellow.bold))