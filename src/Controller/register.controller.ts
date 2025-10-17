import { Request, Response } from 'express';
import { UserEntity } from '../Entity/user.entity';
import bcrypt from "bcryptjs"

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
        const { username, email, password, gender, phone, address ,role} = req.body;

        // 1️⃣ تأكد إن المستخدم مش موجود بالفعل
        const existingUser = await UserEntity.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const EncodePassword= await bcrypt.hash(password,10)

        // 2️⃣ إنشاء كائن من UserEntity
        const userEntity = new UserEntity({
            username,
            email,
            password:EncodePassword,
            gender,
            phone,
            address,
            isVerify: false,
            role
        });

        // 3️⃣ حفظ المستخدم في قاعدة البيانات
        const newUser = await userEntity.save();

        // 4️⃣ رجّع استجابة ناجحة
        res.status(201).json({
            message: 'User registered successfully',
            user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
            }
        });
        } catch (error: any) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    }
