import e from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./shared/middlewares/errorHandler.middleware";
const app = e();

// Middlewares
app.use(e.json());
app.use(cookieParser());

// Routes

// Error Handler
app.use(errorHandler);

export default app;
