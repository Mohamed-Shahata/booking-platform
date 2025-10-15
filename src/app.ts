import e from "express";
import cookieParser from "cookie-parser";
const app = e();

// Middlewares
app.use(e.json());
app.use(cookieParser());

// Routes

// Error Handler

export default app;
