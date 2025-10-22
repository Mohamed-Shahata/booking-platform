import cron from "node-cron";
import User from "../DB/model/user.model";

cron.schedule("0 0 * * *", async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  await User.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: sevenDaysAgo },
  });

  console.log("[CRON] Deleted users older than 7 days.");
});
