import express from "express"
import notesRoutes from "./routes/notesRoutes.js"

const app = express()

app.use("/hariom/notes", notesRoutes)

// listening to the route(declaring restaurant is open for public)
app.listen(5001, ()=>{
    console.log("Server started on PORT: 5001")
}
)