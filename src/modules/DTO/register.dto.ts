import { z } from 'zod';

export class AuthValidation {
    public static registerSchema = z.object({
        body: z.object({
            username: z.string()
                .min(6, 'Name too short')
                .max(15, 'Name too long')
                .nonempty('Username required')
                .regex(/^[A-Za-z][A-Za-z0-9]*$/, 'Username must start with a letter and contain only letters and numbers'),

            email: z.string().email('Invalid email').nonempty('Email required'),

            password: z.string()
                .min(8, 'Password too short')
                .max(12, 'Password too long')
                .nonempty('Password required')
                .regex(/^[A-Za-z](?=.*\d).+$/, 'Password must start with a letter and contain at least one number')
            })
    });

    public static RegisterInputType = this.registerSchema.shape.body;
}

// نوع بيانات body فقط
export type RegisterInput = z.infer<typeof AuthValidation["registerSchema"]>["body"];
