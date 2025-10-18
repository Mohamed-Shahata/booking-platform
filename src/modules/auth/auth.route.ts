import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import AuthController from "./auth.controller";
import { registerSchema } from "./dto/register.dto";
import validate from "../../shared/middlewares/validation.middleware";

class AuthRouter {
  router = Router();
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      "/register",
      validate(registerSchema),
      expressAsyncHandler(this.authController.register)
    );
  };
}
export default AuthRouter;
