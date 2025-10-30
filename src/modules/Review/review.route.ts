import { Router } from "express";
import ReviewController from "./review.controller";
import { auth, authRoles } from "../../shared/middlewares/auth.middleware";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import validate from "../../shared/middlewares/validation.middleware";
import { createReviewSchema } from "./dto/create.dto";
import { getAllReviewSchema } from "./dto/getAll";
import expressAsyncHandler from "express-async-handler";

class ReviewRouter {
  router = Router();
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.initRoutes();
  }

  private initRoutes() {
    // GET ~/reviews/system
    this.router.get(
      "/system",
      validate(getAllReviewSchema),
      expressAsyncHandler(this.reviewController.getAllReviewsSystem)
    );

    // GET ~/reviews/experts
    this.router.get(
      "/experts",
      validate(getAllReviewSchema),
      auth,
      expressAsyncHandler(this.reviewController.getAllReviewsExperts)
    );

    // Get ~/reviews/:expertId
    this.router.get(
      "/:expertId",
      auth,
      expressAsyncHandler(this.reviewController.getReviewsOneExpert)
    );

    // POST ~/reviews/create
    this.router.post(
      "/create",
      validate(createReviewSchema),
      auth,
      authRoles(UserRoles.ADMIN, UserRoles.CLIENT),
      expressAsyncHandler(this.reviewController.create)
    );

    // DELETE ~/reviews/delete/:reviewId
    this.router.delete(
      "/delete/:reviewId",
      auth,
      authRoles(UserRoles.ADMIN, UserRoles.CLIENT),
      expressAsyncHandler(this.reviewController.delete)
    );
  }
}

export default ReviewRouter;
