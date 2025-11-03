import cron from "node-cron";
import Session from "../DB/model/session.model";
import { SessionService } from "../modules/Session/session.service";
import PaymentService from "../modules/Payment/payment.service";
import { PaymentStatus, SessionStatus } from "../modules/Session/session.enum";

const sessionService = new SessionService();
const paymentService = new PaymentService();

export function startSessionFinalizer() {
  const job = cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    const gracePeriod = 10 * 60 * 1000; // 10 min

    // 1️⃣ Start sessions when their time arrives
    const toStart = await Session.find({
      status: SessionStatus.SCHEDULED,
      paymentStatus: PaymentStatus.PAID,
      scheduledAt: { $lte: now },
    });

    for (const s of toStart) {
      await sessionService.startSession(s._id);
      console.log(`🚀 Session ${s._id} started`);
    }

    // 2️⃣ Complete sessions when duration time has passed
    const inProgressSessions = await Session.find({
      status: SessionStatus.IN_PROGRESS,
      paymentStatus: PaymentStatus.PAID,
    });

    for (const s of inProgressSessions) {
      const sessionEndTime = new Date(
        s.scheduledAt.getTime() + s.durationMinutes * 60 * 1000
      );

      if (now >= sessionEndTime) {
        await sessionService.completeSession(s._id);
        s.paymentStatus = PaymentStatus.HELD;
        s.payoutReleaseAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        await s.save();

        console.log(
          `💰 Session ${s._id} funds held until ${s.payoutReleaseAt}`
        );
      }
    }

    // 3️⃣ Refund sessions if expert never joined after grace period
    const toRefund = await Session.find({
      status: SessionStatus.IN_PROGRESS,
      paymentStatus: PaymentStatus.PAID,
      expertJoinedAt: null,
      scheduledAt: { $lte: new Date(now.getTime() - gracePeriod) },
    });

    for (const s of toRefund) {
      await sessionService.refundSession(s._id);
      console.log(`💸 Session ${s._id} refunded (expert not joined)`);
    }
  });

  job.start();
}
