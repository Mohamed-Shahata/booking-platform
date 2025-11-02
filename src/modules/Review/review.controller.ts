import { Request, Response } from "express";
import ReviewService from "./review.service";
import sendResponse from "../../shared/utils/sendResponse";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { CustomRequest } from "../../shared/middlewares/auth.middleware";
import { Types } from "mongoose";
import AppError from "../../shared/errors/app.error";

class ReviewController {
  private reviewService: ReviewService;
  constructor() {
    this.reviewService = new ReviewService();
  }

  // Get ~/reviews/system
  public getAllReviewsSystem = async (req: Request, res: Response) => {
    const dto = req.query;

    const reviews = await this.reviewService.getAllReviewsSystem(dto);

    sendResponse(res, StatusCode.OK, { data: { reviews }, success: true });
  };

  // Get ~/reviews/experts
  public getAllReviewsExperts = async (req: Request, res: Response) => {
    const dto = req.query;

    const reviews = await this.reviewService.getAllReviewsExperts(dto);

    sendResponse(res, StatusCode.OK, { data: { reviews }, success: true });
  };

  // Get ~/reviews/:expertId
  public getReviewsOneExpert = async (req: Request, res: Response) => {
    const dto = req.query;
    const expertId = new Types.ObjectId(req.params.expertId);
    if (Types.ObjectId.isValid(expertId))
      throw new AppError("Invalid expertId", StatusCode.BAD_REQUEST);

    const user = await this.reviewService.getReviewsOneExpert(expertId, dto);

    sendResponse(res, StatusCode.OK, {
      data: { user },
      success: true,
      message: "Done",
    });
  };
   // Get ~/reviews/complaints-suggestions/find
  public getAllComplaints = async (req: Request, res: Response) => {
    const dto = req.query; // query params for filtering

    const data = await this.reviewService.getAllComplaints(dto);

    sendResponse(res, StatusCode.OK, {
      data,
      success: true,
      message: "Fetched complaints/suggestions successfully",
    });
  };

  // Post ~/reviews/create
  public create = async (req: CustomRequest, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id);
    const dto = req.body;

    const { message } = await this.reviewService.create(userId, dto);

    sendResponse(res, StatusCode.CREATED, { message, success: true });
  };
  // Post ~create/complaints-suggestions/
public createComplaints = async (req: CustomRequest, res: Response) => {
  const userId = new Types.ObjectId(req.user?.id);
  const dto = req.body;
  const file = req.file; 

  const { message } = await this.reviewService.createComplaintSuggestion(
    userId,
    dto,
    file
  );

  sendResponse(res, StatusCode.CREATED, { message, success: true });
};


  // Delete ~/reviews/delete/:reviewId
  public delete = async (req: CustomRequest, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id);
    const reviewId = new Types.ObjectId(req.params.reviewId);

    if (Types.ObjectId.isValid(reviewId))
      throw new AppError("Invalid reviewId", StatusCode.BAD_REQUEST);

    const { message } = await this.reviewService.delete(userId, reviewId);

    sendResponse(res, StatusCode.CREATED, { message, success: true });
  };
}

export default ReviewController;
