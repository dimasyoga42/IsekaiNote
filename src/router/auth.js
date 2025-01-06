import express from "express"
import { PrismaClient } from "@prisma/client"
import bycrypt from "bcrypt"
import authtentcation from "../../controller/authtentication.js"
import authMiddle from "../middleware/authMiddle.js"
import { successResponse } from "../utils/respon.js"
const auth = express.Router()
const prisma = new PrismaClient()
//register 
auth.post("/register", authMiddle, async (req, res) => {
    const { username, password} = req.body;
    try {
        const decodedPassword = await bycrypt.hash(password, 10)
        const user = await prisma.user.create({
    data: {
        username: username,
        password: decodedPassword,
    }
        })
        successResponse(res, "user berhasil di registerasi ")
    } catch (error) {
        
    }

})
auth.post("/login", authtentcation, async (req, res) => {
    const { username, password} = req.body;
})
export default auth;