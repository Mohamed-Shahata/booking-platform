import cron from "node-cron";
import User from "../DB/model/user.model";
import CloudinaryService from "../shared/services/cloudinary.service";

cron.schedule("0 0 * * *", async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const usersToDelete = await User.find({
    isDeleted: true,
    deletedAt: { $lte: sevenDaysAgo },
  });

  if (usersToDelete.length === 0) return;

  await Promise.all(
    usersToDelete.map(async (user) => {
      if (user.avatar?.publicId)
        await CloudinaryService.deleteImage(user.avatar.publicId);
    })
  );

  await User.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: sevenDaysAgo },
  });

  console.log("[CRON] Deleted users older than 7 days.");
});
