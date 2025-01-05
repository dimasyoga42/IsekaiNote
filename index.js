import express from "express"
import { PrismaClient } from "@prisma/client";
import cors from "cors"
import auth from "./src/router/auth.js";
import authMiddle from "./src/middleware/authMiddle.js";
import authtentcation from "./controller/authtentication.js";
import cookieParser from "cookie-parser";
import dashbord from "./src/router/dashbord.js";
import notePost from "./src/router/postNote.js";
const app = express()
const prisma = new PrismaClient()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/auth", auth);
app.use("/dashbord", dashbord, notePost)
app.listen(2000, () => {
    console.log("server running")
})

