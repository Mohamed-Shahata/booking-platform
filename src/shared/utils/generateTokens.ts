import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface JWTData {
  id: Types.ObjectId;
  role: string;
}

// generate a new access Token
export const generateAccessToken = (data: JWTData) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
