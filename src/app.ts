import e from "express";
import cors from "cors";
import AuthRouter from "./modules/Auth/auth.route";
import errorHandler from "./shared/middlewares/errorHandler.middleware";
import UserRouter from "./modules/User/user.route";
import "./jobs/deleteExpiredUser.job";
import { corsOptions } from "./config/corsOptions.config";
import ReviewRouter from "./modules/Review/review.route";
const app = e();

// CORS Configuration
app.use(cors(corsOptions));

// init Routes
const authRoutes = new AuthRouter();
const userRoutes = new UserRouter();
const reviewRoutes = new ReviewRouter();

// Middlewares
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes.router);
app.use("/api/v1/users", userRoutes.router);
app.use("/api/v1/reviews", reviewRoutes.router);

// Error Handler
app.use(errorHandler);

export default app;
