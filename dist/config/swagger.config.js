"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
function setupSwagger(app) {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Booking Platform APIs Docs",
                version: "1.0.0",
                description: "A real-time appointment and consultation booking platform that connects clients with experts across various fields such as IT, healthcare, and business. Users can browse experts, schedule sessions, make online payments, and join live chat or video consultation rooms with time tracking and notification features.",
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
        apis: ["./src/modules/**/*.ts"],
    };
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log("Swagger Docs available");
}
