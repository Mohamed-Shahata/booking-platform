import { Request, Response } from "express";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import sendResponse from "../../shared/utils/sendResponse";
import PaymentService from "./payment.service";
import { Types } from "mongoose";
import { PaymentStatus } from "../Session/session.enum";
import AppError from "../../shared/errors/app.error";
import Session from "../../DB/model/session.model";

export class PaymentController {
  private paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }

  public createPayment = async (req: Request, res: Response) => {
    const dto = req.body;
    const sessionId = new Types.ObjectId(req.params.sessionId);

    const result = await this.paymentService.createPaymentForSession(
      sessionId,
      dto
    );

    sendResponse(res, StatusCode.CREATED, { data: { result }, success: true });
  };

  public handlePaymobWebhook = async (req: Request, res: Response) => {
    const data = req.body.obj;
    const orderId = data.order.id;
    const success = data.success;

    const session = await Session.findOne({ paymobOrderId: orderId });
    if (!session) throw new AppError("Session not found", StatusCode.NOT_FOUND);

    if (success) {
      session.paymentStatus = PaymentStatus.PAID;
      await session.save();
    }

    sendResponse(res, StatusCode.OK, {
      success: true,
      message: "Webhook received",
    });
  };
}

export default PaymentController;
