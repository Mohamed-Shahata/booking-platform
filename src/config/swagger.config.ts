import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Booking Platform APIs Docs",
        version: "1.0.0",
        description:
          "A real-time appointment and consultation booking platform that connects clients with experts across various fields such as IT, healthcare, and business. Users can browse experts, schedule sessions, make online payments, and join live chat or video consultation rooms with time tracking and notification features.",
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

  const swaggerSpec = swaggerJsDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("Swagger Docs available");
}
