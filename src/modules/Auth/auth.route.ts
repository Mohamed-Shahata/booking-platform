import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import AuthController from "./auth.controller";
import validate from "../../shared/middlewares/validation.middleware";
import { verifyEmailSchema } from "./dto/verifyEmail.dto";
import { registerClientSchema } from "./dto/registerClient.dto";
import { loginSchema } from "./dto/login.dto";
import { restPasswordSchema } from "./dto/restPassword.dto";
import { forgetPasswordSchema } from "./dto/forgetPassword.dto";
import { resendCodeSchema } from "./dto/resendCode.dto";
import { registerExpertSchema } from "./dto/registerExpert.dto";
import { uploadFile } from "../../shared/middlewares/multer.middleware";
import { googleLoginSchema } from "./dto/loginWithGoogle.dto";

class AuthRouter {
  router = Router();
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.initRoutes();
  }

  private initRoutes = () => {
    // POST ~/auth/register-client
    this.router.post(
      "/register-client",
      validate(registerClientSchema),
      expressAsyncHandler(this.authController.registerClient)
    );

    // POST ~/auth/register-expert
    this.router.post(
      "/register-expert",
      uploadFile.single("cv"),
      validate(registerExpertSchema),
      expressAsyncHandler(this.authController.registerExpert)
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

    //POST ~/auth/google-login
    this.router.post(
      "/google-login",
      validate(googleLoginSchema),
      this.authController.loginWithGoogle
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
