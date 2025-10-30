import ReviewService from "./review.service";

class ReviewController {
  private reviewService: ReviewService;
  constructor() {
    this.reviewService = new ReviewService();
  }
}

export default ReviewController;
