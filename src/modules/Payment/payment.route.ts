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

  private initRoutes() {
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
