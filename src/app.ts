import e from "express";
import cookieParser from "cookie-parser";

import {AuthRoutes} from './modules/auth/auth.router'
import path from "path";

import errorHandler from "./Shared/middlewares/errorHandler.middleware";


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
app.use(errorHandler);

export default app;
