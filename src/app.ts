import e, { Request, Response } from "express";
import cors from "cors";
import AuthRouter from "./modules/Auth/auth.route";
import errorHandler from "./shared/middlewares/errorHandler.middleware";
import UserRouter from "./modules/User/user.route";
import "./jobs/deleteExpiredUser.job";
import { corsOptions } from "./config/corsOptions.config";
import ReviewRouter from "./modules/Review/review.route";
import SessionRouter from "./modules/Session/session.route";
import PaymentRouter from "./modules/Payment/payment.route";
import ChatRouter from "./modules/Chat/chat.route";
import { setupSwagger } from "./config/swagger.config";
import sendResponse from "./shared/utils/sendResponse";
import { StatusCode } from "./shared/enums/statusCode.enum";

const app = e();

// CORS Configuration
app.use(cors(corsOptions));

// init Routes
const authRoutes = new AuthRouter();
const userRoutes = new UserRouter();
const reviewRoutes = new ReviewRouter();
const sessionRoutes = new SessionRouter();
const paymentRoutes = new PaymentRouter();
const chatRoutes = new ChatRouter();

// Middlewares
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

// Routes
// init endpoint
app.get("/", (req: Request, res: Response) =>
  res.send("Consultation platform API")
);

// Endpoints
app.use("/api/v1/auth", authRoutes.router);
app.use("/api/v1/users", userRoutes.router);
app.use("/api/v1/reviews", reviewRoutes.router);
app.use("/api/v1/sessions", sessionRoutes.router);
app.use("/api/v1/payments", paymentRoutes.router);
app.use("/api/v1/chats", chatRoutes.router);

// Error Handler
app.use(errorHandler);

// Swagger UI
setupSwagger(app);

// Invalid route handler (404)
app.all(/.*/, (req, res) => {
  sendResponse(res, StatusCode.NOT_FOUND, {
    success: false,
    message: `Can't find ${req.originalUrl} on this server 🚫`,
  });
});
export default app;
