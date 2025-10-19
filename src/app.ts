import e from "express";
import cookieParser from "cookie-parser";
import AuthRouter from "./modules/Auth/auth.route";
import errorHandler from "./shared/middlewares/errorHandler.middleware";

const app = e();

// init Routes
const authRoutes = new AuthRouter();

// Middlewares
app.use(e.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes.router);

// Error Handler
app.use(errorHandler);

export default app;
