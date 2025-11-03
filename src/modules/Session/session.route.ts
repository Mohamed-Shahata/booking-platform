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

  private initRoutes() {
    this.router.post(
      "/create",
      validate(createSessionSchema),
      auth,
      authRoles(UserRoles.CLIENT, UserRoles.ADMIN),
      expressAsyncHandler(this.sessionController.createSession)
    );

    this.router.post(
      "/:sessionId/start",
      auth,
      authRoles(UserRoles.CLIENT, UserRoles.ADMIN),
      expressAsyncHandler(this.sessionController.start)
    );

    this.router.post(
      "/:sessionId/complete",
      auth,
      authRoles(UserRoles.CLIENT, UserRoles.ADMIN),
      expressAsyncHandler(this.sessionController.complete)
    );
  }
}

export default SessionRouter;
