"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/Auth/auth.route"));
const errorHandler_middleware_1 = __importDefault(require("./shared/middlewares/errorHandler.middleware"));
const user_route_1 = __importDefault(require("./modules/User/user.route"));
require("./jobs/deleteExpiredUser.job");
const corsOptions_config_1 = require("./config/corsOptions.config");
const app = (0, express_1.default)();
// CORS Configuration
app.use((0, cors_1.default)(corsOptions_config_1.corsOptions));
// init Routes
const authRoutes = new auth_route_1.default();
const userRoutes = new user_route_1.default();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/v1/auth", authRoutes.router);
app.use("/api/v1/users", userRoutes.router);
// Error Handler
app.use(errorHandler_middleware_1.default);
exports.default = app;
