import express from "express"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
import protection from "../middleware/protectionUser.js"
dotenv.config()
const prisma = new PrismaClient()
//post delete update

const notePost = express.Router()

notePost.post("/post", protection, async (req, res) => {
    const { title, content} = req.body;
    const user = req.user
    const getNote = await prisma.data.create({
        data: {
            title: title,
            content: content,
            userID: user.id
        }
    })
    res.status(200).json({message: "catatan berhasil di buat", getNote})
})

notePost.delete("/delete", protection, async (req, res) => {
    const { id } = req.body
    const user = req.user
    try {
        const findData = await prisma.data.findFirst({where: {id: id, userID: user.id}})
        if(!findData) return res.status(403).json({message: "catatan tidak di temukan"})
        const dataDelete = await prisma.data.delete({
            id: id
        })
        res.status(200).json({message: "data berhasil di hapus"})        
    } catch (Error) {
        console.error({err: Error})
    }

})

notePost.post("/update", protection, async (req, res) => {
    const {id, title, content} = req.body;
    const user = req.user
    try {
        if(!title || !content) return res.status(401).json({message: "title & content tidak boleh kosong"})
        const validData = await prisma.data.update({where: {id: id},
            data: {
                title: title,
                content: content
            }
        })
        res.status(200).json({message: "data berhasil terupdate", validData})
    } catch (error) {
        
    }
})
export default notePost;