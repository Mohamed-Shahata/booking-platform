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

  private initRoutes() {
    this.router.get(
      "/:sessionId",
      auth,
      authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.chatController.getMessagesBySession)
    );
  }
}

export default ChatRouter;
