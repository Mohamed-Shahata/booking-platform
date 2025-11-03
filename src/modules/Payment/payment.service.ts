import axios from "axios";
import Session from "../../DB/model/session.model";
import { SessionService } from "../Session/session.service";
import AppError from "../../shared/errors/app.error";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { PaymentStatus, SessionStatus } from "../Session/session.enum";
import ExpertProfile from "../../DB/model/expertProfile.model";
import { IExpertProfile } from "../User/user.type";
import { Types } from "mongoose";
import { CreatePaymentForSessionBodyDto } from "./dto/createPaymentForSession.dto";

const PAYMOB_API = "https://accept.paymob.com/api";

class PaymentService {
  private sessionService: SessionService;
  constructor() {
    this.sessionService = new SessionService();
  }

  public auth = async () => {
    const res = await axios.post(`${PAYMOB_API}/auth/tokens`, {
      api_key: process.env.PAYMOB_API_KEY,
    });
    return res.data.token;
  };

  public createPaymobOrder = async (amount: number, token: string) => {
    const res = await axios.post(`${PAYMOB_API}/ecommerce/orders`, {
      auth_token: token,
      amount_cents: Math.round(amount * 100),
      currency: "EGP",
      delivery_needed: false,
      items: [],
    });
    return res.data;
  };

  public createPaymentKey = async (
    amount: number,
    orderId: number,
    clientEmail: string,
    token: string
  ) => {
    const billingData = {
      apartment: "NA",
      email: clientEmail,
      floor: "NA",
      first_name: "Client",
      last_name: "User",
      phone_number: "+201000000000",
      street: "NA",
      building: "NA",
      city: "Cairo",
      country: "EG",
      state: "Cairo",
    };
    const res = await axios.post(`${PAYMOB_API}/acceptance/payment_keys`, {
      auth_token: token,
      amount_cents: Math.round(amount * 100),
      currency: "EGP",
      order_id: orderId,
      billing_data: billingData,
      integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
    });
    return res.data;
  };

  public createPaymentForSession = async (
    sessionId: Types.ObjectId,
    dto: CreatePaymentForSessionBodyDto
  ) => {
    const { clientEmail } = dto;
    const session = await Session.findById(sessionId);
    if (!session) throw new AppError("Session not found", StatusCode.NOT_FOUND);
    if (session.paymentStatus === PaymentStatus.PAID)
      throw new AppError("Already paid", StatusCode.NOT_FOUND);

    const token = await this.auth();
    const order = await this.createPaymobOrder(session.price, token);
    const paymentKey = await this.createPaymentKey(
      session.price,
      order.id,
      clientEmail,
      token
    );

    session.paymobOrderId = order.id;
    session.paymobPaymentToken = paymentKey.token;
    await session.save();

    const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/863248?payment_token=${paymentKey.token}`; // or direct accept iframe
    return { iframeUrl, paymentToken: paymentKey.token };
  };

  // Platform payout (placeholder) — implement via bank transfer or Paymob payout if available
  public payoutToExpert = async (sessionId: Types.ObjectId) => {
    const session = await Session.findById(sessionId);
    if (!session) throw new Error("Session not found");
    if (session.status !== SessionStatus.COMPLETED)
      throw new AppError("Session not completed yet", StatusCode.BAD_REQUEST);

    const commissionPercent = Number(
      process.env.PLATFORM_COMMISSION_PERCENT || 10
    );
    const commission = Math.round((session.price * commissionPercent) / 100);
    const expertAmount = session.price - commission;

    // For demo: increase expert wallet
    await ExpertProfile.findOneAndUpdate(
      { userId: session.expertId },
      { $inc: { wallet: expertAmount } },
      { new: true }
    );

    return { commission, expertAmount };
  };
}

export default PaymentService;
