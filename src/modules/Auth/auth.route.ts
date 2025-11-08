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

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication and user account management endpoints including registration, login, password reset, and email verification
   */
  private initRoutes = () => {
    /**
     * @swagger
     * /auth/register-client:
     *   post:
     *     summary: Register a new client
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 example: "JohnDoe"
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "john@example.com"
     *               phone:
     *                 type: string
     *                 example: "01234567890"
     *               password:
     *                 type: string
     *                 example: "Password@123"
     *               gender:
     *                 type: string
     *                 enum: [MALE, FEMALE, OTHER]
     *             required:
     *               - username
     *               - email
     *               - phone
     *               - password
     *               - gender
     *     responses:
     *       201:
     *         description: Client registered successfully
     */
    this.router.post(
      "/register-client",
      validate(registerClientSchema),
      expressAsyncHandler(this.authController.registerClient)
    );

    /**
     * @swagger
     * /auth/register-expert:
     *   post:
     *     summary: Register a new expert with CV upload
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               cv:
     *                 type: string
     *                 format: binary
     *               data:
     *                 type: string
     *                 description: JSON string containing the expert's profile
     *             required:
     *               - cv
     *               - data
     *     responses:
     *       201:
     *         description: Expert registered successfully
     */
    this.router.post(
      "/register-expert",
      uploadFile.single("cv"),
      validate(registerExpertSchema),
      expressAsyncHandler(this.authController.registerExpert)
    );

    /**
     * @swagger
     * /auth/verify:
     *   post:
     *     summary: Verify user email using code sent to inbox
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               code:
     *                 type: string
     *                 minLength: 6
     *             required:
     *               - email
     *               - code
     *     responses:
     *       200:
     *         description: Email verified successfully
     */
    this.router.post(
      "/verify",
      validate(verifyEmailSchema),
      expressAsyncHandler(this.authController.verifyEmail)
    );

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login using email and password
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 8
     *                 maxLength: 50
     *             required:
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: Logged in successfully
     */
    this.router.post(
      "/login",
      validate(loginSchema),
      expressAsyncHandler(this.authController.login)
    );

    /**
     * @swagger
     * /auth/google-login:
     *   post:
     *     summary: Login using Google OAuth token
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idToken:
     *                 type: string
     *                 example: "google-id-token"
     *             required:
     *               - idToken
     *     responses:
     *       200:
     *         description: Logged in with Google successfully
     */
    this.router.post(
      "/google-login",
      validate(googleLoginSchema),
      this.authController.loginWithGoogle
    );

    /**
     * @swagger
     * /auth/forgetPassword:
     *   patch:
     *     summary: Request a password reset code via email
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *             required:
     *               - email
     *     responses:
     *       200:
     *         description: Reset code sent successfully
     */
    this.router.patch(
      "/forgetPassword",
      validate(forgetPasswordSchema),
      expressAsyncHandler(this.authController.forgetPassword)
    );

    /**
     * @swagger
     * /auth/restPassword:
     *   patch:
     *     summary: Reset password using the verification code
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               code:
     *                 type: string
     *                 minLength: 6
     *               password:
     *                 type: string
     *                 minLength: 8
     *                 maxLength: 50
     *             required:
     *               - email
     *               - code
     *               - password
     *     responses:
     *       200:
     *         description: Password reset successfully
     */
    this.router.patch(
      "/restPassword",
      validate(restPasswordSchema),
      expressAsyncHandler(this.authController.restPassword)
    );

    /**
     * @swagger
     * /auth/resendCode:
     *   post:
     *     summary: Resend verification code to email
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *             required:
     *               - email
     *     responses:
     *       200:
     *         description: Code resent successfully
     */
    this.router.post(
      "/resendCode",
      validate(resendCodeSchema),
      expressAsyncHandler(this.authController.resendCode)
    );
  };
}
export default AuthRouter;
