import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Cookies from "js-cookie";
import { errorResponse, successResponse } from "../src/utils/respon.js";
dotenv.config();

const prisma = new PrismaClient();

const authentication = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return errorResponse(res, "username & password harus di isi", 400)
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) return res.status(401).json({ message: "Username atau password salah" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return errorResponse(res, "password yang anda masukan sepertinya salah", 402)
        
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
        return successResponse(res, "anda berhasil login", token)
        
    } catch (error) {
        console.error("Error saat autentikasi:", error);
        return errorResponse(res, "terjadi kesalahan mohon cek kembali", 500)
    } finally {
        next();
    }
};

export default authentication;
