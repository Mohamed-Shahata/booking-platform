"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./modules/Auth/auth.route"));
const errorHandler_middleware_1 = __importDefault(require("./shared/middlewares/errorHandler.middleware"));
const user_route_1 = __importDefault(require("./modules/User/user.route"));
require("./jobs/deleteExpiredUser.job");
const expertProfile_route_1 = __importDefault(require("./modules/ExpertProfile/expertProfile.route"));
const app = (0, express_1.default)();
// init Routes
const authRoutes = new auth_route_1.default();
const userRoutes = new user_route_1.default();
const expertRoutes = new expertProfile_route_1.default();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/v1/auth", authRoutes.router);
app.use("/api/v1/users", userRoutes.router);
app.use("/api/v1/expert", expertRoutes.router);
// Error Handler
app.use(errorHandler_middleware_1.default);
exports.default = app;
