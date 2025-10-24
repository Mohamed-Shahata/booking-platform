import { StatusCode } from "../shared/enums/statusCode.enum";
import AppError from "../shared/errors/app.error";

const allowedOrigins = ["http://localhost:3000"];

export const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError("Not allowed by CORS", StatusCode.BAD_REQUEST));
    }
  },
};
