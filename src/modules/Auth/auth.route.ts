import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import AuthController from "./auth.controller";
import validate from "../../shared/middlewares/validation.middleware";
import { verifyEmailSchema } from "./dto/verifyEmail.dto";
import { registerSchema } from "./dto/register.dto";
import { loginSchema } from "./dto/login.dto";
import { restPasswordSchema } from "./dto/restPassword.dto";
import { forgetPasswordSchema } from "./dto/forgetPassword.dto";
import { resendCodeSchema } from "./dto/resendCode.dto";

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

    // POST ~/auth/login
    this.router.post(
      "/login",
      validate(loginSchema),
      expressAsyncHandler(this.authController.login)
    );
    // patch ~/auth/forgetPassword

    this.router.patch(
      "/forgetPassword",
      validate(forgetPasswordSchema),
      expressAsyncHandler(this.authController.forgetPassword)
    );
    // patch ~/auth/restPassword
    this.router.patch(
      "/restPassword",
      validate(restPasswordSchema),
      expressAsyncHandler(this.authController.restPassword)
    );
        // patch ~/auth/resendCode
    this.router.post(
      "/resendCode",
      validate(resendCodeSchema),
      expressAsyncHandler(this.authController.resendCode)
    );
  };
  
  
}
export default AuthRouter;
