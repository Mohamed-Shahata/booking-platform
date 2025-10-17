import { Request, Response } from 'express';
import { UserService } from '../user/user.services';
import bcrypt from "bcryptjs"
import asyncHandler from 'express-async-handler'
import {StatusCode} from '../../Shared/enums/statusCode.enum'
import sendResponse from '../../utils/sendResponse'

export class AuthController {

    public register = asyncHandler(async (req: Request, res: Response)=>{
        
        const { username, email, password, gender, phone, address ,role } = req.body;

        // 1️⃣ تأكد إن المستخدم مش موجود بالفعل
        const existingUser = await UserService.findUser(email);
        if (existingUser) {
            sendResponse(res, StatusCode.BAD_REQUEST, {
                success: false,
                message: 'User already exists'
            });
        }
        const salt = await bcrypt.genSalt(10)

        const hashedPassword= await bcrypt.hash(password,salt)

        // 2️⃣ إنشاء كائن من Userservice
        let userService=new UserService({username,email,password:hashedPassword,gender,phone,address,role})
        let newUser= await userService.createUser()

        // 4️⃣ رجّع استجابة ناجحة
        sendResponse(res, StatusCode.CREATED, {
            success: true,
            message: 'User registered successfully',
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    });
}
