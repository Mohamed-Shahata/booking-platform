import { Router } from "express";
import { SessionController } from "./session.controller";
import expressAsyncHandler from "express-async-handler";
import { auth, authRoles } from "../../shared/middlewares/auth.middleware";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import { createSessionSchema } from "./dto/create.dto";
import validate from "../../shared/middlewares/validation.middleware";

class SessionRouter {
  router = Router();
  private sessionController: SessionController;

  constructor() {
    this.sessionController = new SessionController();
    this.initRoutes();
  }

  /**
   * @swagger
   * tags:
   *   name: Sessions
   *   description: Managing booking sessions between clients and experts
   */
  private initRoutes() {
    /**
     * @swagger
     * /sessions/create:
     *   post:
     *     summary: Create a new session between client and expert
     *     tags: [Sessions]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               expertId:
     *                 type: string
     *                 description: MongoDB ObjectId of the expert
     *                 example: "64f1c5e2a9f1b2d3c4e5f678"
     *               scheduledAt:
     *                 type: string
     *                 format: date-time
     *                 description: Date and time for the session
     *                 example: "2025-11-10T14:30:00Z"
     *               durationMinutes:
     *                 type: number
     *                 description: Duration of the session in minutes (30-180)
     *                 example: 60
     *               price:
     *                 type: number
     *                 description: Price of the session
     *                 example: 100
     *     responses:
     *       201:
     *         description: Session created successfully
     *       400:
     *         description: Validation failed
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: User is not allowed
     */
    this.router.post(
      "/create",
      validate(createSessionSchema),
      auth,
      authRoles(UserRoles.CLIENT, UserRoles.ADMIN),
      expressAsyncHandler(this.sessionController.createSession)
    );
  }
}

export default SessionRouter;
