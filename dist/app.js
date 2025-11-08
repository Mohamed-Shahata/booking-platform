"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/Auth/auth.route"));
const errorHandler_middleware_1 = __importDefault(require("./shared/middlewares/errorHandler.middleware"));
const user_route_1 = __importDefault(require("./modules/User/user.route"));
require("./jobs/deleteExpiredUser.job");
const corsOptions_config_1 = require("./config/corsOptions.config");
const review_route_1 = __importDefault(require("./modules/Review/review.route"));
const session_route_1 = __importDefault(require("./modules/Session/session.route"));
const payment_route_1 = __importDefault(require("./modules/Payment/payment.route"));
const chat_route_1 = __importDefault(require("./modules/Chat/chat.route"));
const swagger_config_1 = require("./config/swagger.config");
const app = (0, express_1.default)();
// CORS Configuration
app.use((0, cors_1.default)(corsOptions_config_1.corsOptions));
// init Routes
const authRoutes = new auth_route_1.default();
const userRoutes = new user_route_1.default();
const reviewRoutes = new review_route_1.default();
const sessionRoutes = new session_route_1.default();
const paymentRoutes = new payment_route_1.default();
const chatRoutes = new chat_route_1.default();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
// init endpoint
app.get("/", (req, res) => res.send("Consultation platform API"));
// Endpoints
app.use("/api/v1/auth", authRoutes.router);
app.use("/api/v1/users", userRoutes.router);
app.use("/api/v1/reviews", reviewRoutes.router);
app.use("/api/v1/sessions", sessionRoutes.router);
app.use("/api/v1/payments", paymentRoutes.router);
app.use("/api/v1/chats", chatRoutes.router);
// Error Handler
app.use(errorHandler_middleware_1.default);
// Swagger UI
(0, swagger_config_1.setupSwagger)(app);
// Invalid route handler (404)
app.all(/.*/, (req, res) => {
    res.status(404).json({
        success: false,
        message: `Can't find ${req.originalUrl} on this server 🚫`,
    });
});
exports.default = app;
