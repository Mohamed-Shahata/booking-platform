import { Router } from "express";
import ChatController from "./chat.controller";
import expressAsyncHandler from "express-async-handler";
import { auth, authRoles } from "../../shared/middlewares/auth.middleware";
import { UserRoles } from "../../shared/enums/UserRoles.enum";

class ChatRouter {
  router = Router();
  private chatController: ChatController;
  constructor() {
    this.chatController = new ChatController();
    this.initRoutes();
  }

  /**
   * @swagger
   * tags:
   *   name: Chat
   *   description: Endpoints for managing chat messages between clients and experts, accessible only to authorized users
   */
  private initRoutes() {
    /**
     * @swagger
     * /chat/{sessionId}:
     *   get:
     *     tags:
     *       - Chat
     *     summary: Get chat messages for a specific session
     *     description: Returns all chat messages belonging to a specific session. Only ADMIN users are allowed.
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: sessionId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat session
     *     responses:
     *       200:
     *         description: Chat messages retrieved successfully
     *       401:
     *         description: Unauthorized (Invalid or missing token)
     *       403:
     *         description: Forbidden (Only Admin can access this)
     *       404:
     *         description: Session not found
     */
    this.router.get(
      "/:sessionId",
      auth,
      authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.chatController.getMessagesBySession)
    );
  }
}

export default ChatRouter;
