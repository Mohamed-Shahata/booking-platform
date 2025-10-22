import e from "express";
import cookieParser from "cookie-parser";
import AuthRouter from "./modules/Auth/auth.route";
import errorHandler from "./shared/middlewares/errorHandler.middleware";
import UserRouter from "./modules/User/user.route";
import "./jobs/deleteExpiredUser.job";
const app = e();

// init Routes
const authRoutes = new AuthRouter();
const userRoutes = new UserRouter();

// Middlewares
app.use(e.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes.router);
app.use("/api/v1/users", userRoutes.router);

// Error Handler
app.use(errorHandler);

export default app;
