import { Types } from "mongoose";
import { PaymentStatus, SessionStatus } from "./session.enum";

export interface ISession {
  userId: Types.ObjectId;
  expertId: Types.ObjectId;
  scheduledAt: Date;
  durationMinutes: number;
  price: number;
  paymentStatus: PaymentStatus;
  status: SessionStatus;
  expertJoinedAt: Date | null;
  payoutReleaseAt: Date | null;
  paymobOrderId?: number;
  paymobPaymentToken?: string;
}
