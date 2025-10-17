import e from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./shared/middlewares/errorHandler.middleware";
import authRoutes from './Router/register.router';

const app = e();

// Middlewares
app.use(e.json());
app.use(cookieParser());

// Routes

app.use('/v1/api/',authRoutes)

// Error Handler
app.use(errorHandler);

export default app;
