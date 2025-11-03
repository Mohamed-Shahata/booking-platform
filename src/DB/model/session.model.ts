import { Schema, model } from "mongoose";
import { ISession } from "../../modules/Session/session,type";
import {
  PaymentStatus,
  SessionStatus,
} from "../../modules/Session/session.enum";

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expertId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true },
    expertJoinedAt: {
      type: Date,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },
    status: {
      type: String,
      enum: SessionStatus,
      default: SessionStatus.SCHEDULED,
    },
    payoutReleaseAt: {
      type: Date,
      default: null,
    },
    paymobOrderId: { type: Number },
    paymobPaymentToken: { type: String },
  },
  { timestamps: true }
);

const Session = model<ISession>("Session", SessionSchema);
export default Session;
