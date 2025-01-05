import express from "express";
import protection from "../middleware/protectionUser.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const dashboard = express.Router();

dashboard.get("/profil", protection, async (req, res) => {
    const user = req.user;
    const data = await prisma.user.findUnique({where: {
        username: user.username, 
        
    }, include: {
        data: true
    }})
    const schema = {
        uid: data.id,
        username: data.username,
        note: data.data
    }
    res.json({ message: `Selamat datang di profil, ${user.username}`, profile: schema });

});
//fitur cari profil
dashboard.post("/search", protection, async (req, res) => {
    const {uid} = req.body;
    const user = await prisma.user.findUnique({where: {id: uid}, include: {
        data: true
    }})
    if(!user) return res.status(404).json({message: "uid tidak ditemukan"})
        const  resSearch = {
            username: user.username,
            uid: user.id,
            note: user.data
        }
        res.status(200).json({ data: resSearch
    })
})
export default dashboard;
