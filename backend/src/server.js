import express from "express"
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "../config/db.js"
import dotenv from "dotenv"

const app = express()

dotenv.config()

const PORT = process.env.PORT || 3000

connectDB();

// middleware
app.use(express.json())

app.use("/hariom/notes", notesRoutes)

app.listen(PORT, ()=>{
    console.log("Server started on PORT: ",PORT);
})
