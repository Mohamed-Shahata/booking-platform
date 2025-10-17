import e from "express";
import cookieParser from "cookie-parser";
import {AuthRoutes} from './modules/auth/auth.router'
import path from "path";
const app = e();

//
const authRoutes = new AuthRoutes()

// Middlewares
app.use(e.json());
app.use(cookieParser());
app.use(e.static(path.join(__dirname,"public/uploads" )))

// Routes

app.use('/v1/api/',authRoutes.route)

// Error Handler

export default app;
