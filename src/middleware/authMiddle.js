import { PrismaClient } from "@prisma/client"
import { errorResponse } from "../utils/respon.js";
const prisma = new PrismaClient()
const authMiddle = async (req, res, next) => {
    const { username, password} = req.body;
    const valid = await prisma.user.findUnique({where: {
        username: username
    }})
    if(valid) return errorResponse(res, "username sudah ada", 402)
    if(password.length < 6) return errorResponse(res, "password terlalu pendek", 402)
        next()
}
export default authMiddle;