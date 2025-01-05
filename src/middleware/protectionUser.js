import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import Cookies from "js-cookie";
import { errorResponse } from "../utils/respon.js";
const prisma = new PrismaClient();
dotenv.config();
const protection = async (req, res, next) => {
const token = req.cookies.auth_token
    if(!token) return errorResponse(res, "pengguna tidak ditemukan harap login", 404)
const validToken = jwt.verify(token, process.env.JWT_SECRET)
const getUser = await prisma.user.findUnique({where: {
    username: validToken.username
}})
if (!getUser) {
    return errorResponse(res, "pengguna tidak di temukan", 404)
}
req.user = getUser;
next();
}
export default protection;