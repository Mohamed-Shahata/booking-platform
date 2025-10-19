import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import AuthController from "./auth.controller";
import { registerSchema } from "./dto/register.dto";
import validate from "../../shared/middlewares/validation.middleware";
import { verifyEmailSchema } from "./dto/verifyEmail.dto";

class AuthRouter {
  router = Router();
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.initRoutes();
  }

  private initRoutes = () => {
    // POST ~/auth/register
    this.router.post(
      "/register",
      validate(registerSchema),
      expressAsyncHandler(this.authController.register)
    );

    // POST ~/auth/verify
    this.router.post(
      "/verify",
      validate(verifyEmailSchema),
      expressAsyncHandler(this.authController.verifyEmail)
    );
  };
}
export default AuthRouter;
