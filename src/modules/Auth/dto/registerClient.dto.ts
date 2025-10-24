import z from "zod";
import { UserGender } from "../../User/user.enum";

export const registerClientSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(15),
    email: z.email(),
    phone: z
      .string()
      .regex(
        /^(?:01[0-2,5]\d{8}|0\d{8})$/,
        "Phone number must be a valid Egyptian mobile or landline number"
      ),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\-_=\+\[\]\{\};:'",.<>\/?\\|`~]).+$/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    gender: z.enum([UserGender.MALE, UserGender.FEMALE, UserGender.OTHER]),
  }),
});

export type RegisterClientDto = z.infer<typeof registerClientSchema>["body"];
