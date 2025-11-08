import { Router } from "express";
import PaymentController from "./payment.controller";
import { auth } from "../../shared/middlewares/auth.middleware";
import validate from "../../shared/middlewares/validation.middleware";
import { createPaymentForSessionSchema } from "./dto/createPaymentForSession.dto";
import expressAsyncHandler from "express-async-handler";

class PaymentRouter {
  router = Router();
  private paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.initRoutes();
  }

  /**
   * @swagger
   * tags:
   *   name: Payment
   *   description: Endpoints for handling payments and Paymob webhook callbacks
   */
  private initRoutes() {
    /**
     * @swagger
     * /payment/pay/{sessionId}:
     *   post:
     *     summary: Create a payment for a specific chat session
     *     tags: [Payment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: sessionId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the chat session to pay for (MongoDB ObjectId)
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               clientEmail:
     *                 type: string
     *                 format: email
     *                 description: Email of the client making the payment
     *                 example: "client@example.com"
     *     responses:
     *       201:
     *         description: Payment link created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 paymentToken:
     *                   type: string
     *                   example: "IOSJFIOPSDFOPKFPOIWEG5EF547G5ERHWEG..."
     *       400:
     *         description: Validation error or bad request
     *       401:
     *         description: Unauthorized
     */
    this.router.post(
      "/pay/:sessionId",
      auth,
      validate(createPaymentForSessionSchema),
      expressAsyncHandler(this.paymentController.createPayment)
    );

    this.router.post(
      "/webhook",
      expressAsyncHandler(this.paymentController.handlePaymobWebhook)
    );
  }
}

export default PaymentRouter;
