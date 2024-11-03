import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/connectDB.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json()) //middelware allowing us tp parse incoming requests using req.body 
app.use(cookieParser()) //allows to parse incoming cookies 
app.use("/api/auth", authRoutes)


app.listen(PORT, ()=>{
    connectDB()
    console.log("Server is running on port", PORT)
})