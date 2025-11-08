import { Types } from "mongoose";
import Session from "../../DB/model/session.model";
import { CreateSessionDto } from "./dto/create.dto";
import { MarkPaidDto } from "./dto/markPaid.dto";
import { ISession } from "./session,type";
import { PaymentStatus, SessionStatus } from "./session.enum";
import AppError from "../../shared/errors/app.error";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import User from "../../DB/model/user.model";

export class SessionService {
  public createSession = async (
    userId: Types.ObjectId,
    dto: CreateSessionDto
  ) => {
    const { expertId, scheduledAt, durationMinutes, price } = dto;

    const now = new Date();
    const scheduledAtDate = new Date(scheduledAt);
    const minAllowedTime = new Date(now.getTime() + 30 * 60 * 1000);

    const expert = await User.findById(expertId);
    if (!expert || !expert.isVerified)
      throw new AppError("Expert not found", StatusCode.NOT_FOUND);

    if (scheduledAtDate < minAllowedTime) {
      throw new AppError(
        "The scheduled time must be at least 30 minutes in the future.",
        StatusCode.BAD_REQUEST
      );
    }

    const session = await Session.create({
      userId,
      expertId,
      scheduledAt,
      durationMinutes,
      price,
    });
    return session;
  };

  public markPaid = async (
    sessionId: Types.ObjectId,
    dto: MarkPaidDto
  ): Promise<ISession> => {
    const { paymobOrderId, paymobPaymentToken } = dto;

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { paymentStatus: PaymentStatus.PAID, paymobOrderId, paymobPaymentToken },
      { new: true }
    );

    if (!session)
      throw new AppError("Seession not found", StatusCode.NOT_FOUND);

    return session;
  };

  public startSession = async (
    sessionId: Types.ObjectId
  ): Promise<ISession> => {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status: SessionStatus.IN_PROGRESS },
      { new: true }
    );

    if (!session)
      throw new AppError("Seession not found", StatusCode.NOT_FOUND);

    return session;
  };

  public completeSession = async (
    sessionId: Types.ObjectId
  ): Promise<ISession> => {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status: SessionStatus.COMPLETED },
      { new: true }
    );

    if (!session)
      throw new AppError("Seession not found", StatusCode.NOT_FOUND);

    return session;
  };

  public refundSession = async (
    sessionId: Types.ObjectId
  ): Promise<ISession> => {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      {
        paymentStatus: PaymentStatus.REFUNDED,
        status: SessionStatus.CANCELLED,
      },
      { new: true }
    );
    if (!session)
      throw new AppError("Seession not found", StatusCode.NOT_FOUND);

    return session;
  };
}

export const sessionService = new SessionService();
