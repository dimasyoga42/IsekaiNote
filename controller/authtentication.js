import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Cookies from "js-cookie";
dotenv.config();

const prisma = new PrismaClient();

const authentication = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username dan password wajib diisi" });
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) return res.status(401).json({ message: "Username atau password salah" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Username atau password salah" });
        
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } 
        );

       
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 3600 * 1000, 
        });
        return res.status(200).json({ message: "Berhasil login", token });
        
    } catch (error) {
        console.error("Error saat autentikasi:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    } finally {
        next();
    }
};

export default authentication;
