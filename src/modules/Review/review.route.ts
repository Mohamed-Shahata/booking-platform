import { Router } from "express";
import ReviewController from "./review.controller";

class ReviewRouter {
  router = Router();
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.initRoutes();
  }

  private initRoutes() {}
}

export default ReviewRouter;
