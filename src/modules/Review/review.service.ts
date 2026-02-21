import { Types } from "mongoose";
import { CreateReviewDto } from "./dto/create.dto";
import Review from "../../DB/model/review.model";
import ExpertProfile from "../../DB/model/expertProfile.model";
import AppError from "../../shared/errors/app.error";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { getPagination } from "../../shared/utils/pagination";
import { ReviewProvider } from "./review.enum";
import { IReview } from "./review.type";
import { GetAllReviewDto } from "./dto/getAll";
import { CreateComplaintSuggestionDto } from "./dto/createcomplaintOrSuggestion.dto";
import ComplaintSuggestion from "../../DB/model/complaintSuggestion.model";
import { CloudinaryFolders } from "../../shared/utils/constant";
import CloudinaryService from "../../shared/services/cloudinary.service";
import { ComplaintType } from "./complaintSuggestion.enum";
import { FindComplaintSuggestionDto } from "./dto/getComplaintSuggestion.dto";


class ReviewService {
  /**
   * Retrieves all system-generated reviews.
   *
   * @param dto - Pagination parameters (page, limit).
   * @returns Promise resolving to an array of reviews created by the SYSTEM provider.
   */
  public getAllReviewsSystem = async (
    dto: GetAllReviewDto
  ): Promise<IReview[]> => {
    const { page, limit } = dto;
    const { limitNumber, skip } = getPagination(page, limit);

    const reviews = await Review.find({ provider: ReviewProvider.SYSTEM })
      .limit(limitNumber)
      .skip(skip);

    return reviews;
  };

  /**
   * Retrieves all expert-generated reviews.
   *
   * @param dto - Pagination parameters (page, limit).
   * @returns Promise resolving to an array of reviews created by EXPERT providers.
   */
  public getAllReviewsExperts = async (
    dto: GetAllReviewDto
  ): Promise<IReview[]> => {
    const { page, limit } = dto;
    const { limitNumber, skip } = getPagination(page, limit);

    const reviews = await Review.find({ provider: ReviewProvider.EXPERT })
      .limit(limitNumber)
      .skip(skip);

    return reviews;
  };

  /**
   * Retrieves all reviews for a specific expert.
   *
   * @param expertId - The ID of the expert whose reviews are being fetched.
   * @param dto - Pagination parameters (page, limit).
   * @returns Promise resolving to an array of reviews belonging to the specified expert.
   */
  public getReviewsOneExpert = async (
    expertId: Types.ObjectId,
    dto: GetAllReviewDto
  ): Promise<IReview[]> => {
    const { page, limit } = dto;
    const { limitNumber, skip } = getPagination(page, limit);

    const reviews = await Review.find({ expertId })
      .limit(limitNumber)
      .skip(skip);
      
    return reviews;
  };

  /**
   * Creates a new review for an expert.
   *
   * @param userId - The ID of the user creating the review.
   * @param dto - Review details including expertId, text, stars, and provider.
   * @returns Promise resolving to a success message after creation.
   */
  public create = async (
    userId: Types.ObjectId,
    dto: CreateReviewDto
  ): Promise<{ message: string }> => {
    const { expertId, text, stars, provider } = dto;

    const newReview = await Review.create({
      userId,
      text,
      stars,
      provider,
      expertId,
    });

    await ExpertProfile.findByIdAndUpdate(expertId, [
      {
        $set: {
          numReviews: { $add: ["$numReviews", 1] },
          rateing: {
            $divide: [
              { $add: [{ $multiply: ["$rateing", "$numReviews"] }, stars] },
              { $add: ["$numReviews", 1] },
            ],
          },
        },
      },
      {
        $addFields: {
          reviews: { $concatArrays: ["$reviews", [newReview._id]] },
        },
      },
    ]);

    return { message: "Created a new review successfully" };
  };

  /**
   * Deletes a review if it belongs to the given user.
   *
   * @param userId - The ID of the user requesting deletion.
   * @param reviewId - The ID of the review to delete.
   * @returns Promise resolving to a success message if deletion is successful.
   * @throws AppError if the review is not found or does not belong to the user.
   */
  public delete = async (
    userId: Types.ObjectId,
    reviewId: Types.ObjectId
  ): Promise<{ message: string }> => {
    const review = await Review.findById(reviewId);

    if (!review) throw new AppError("Review not found", StatusCode.NOT_FOUND);

    if (review.userId !== userId)
      throw new AppError(
        "Access deined, you can not deletign this review",
        StatusCode.BAD_REQUEST
      );

    await ExpertProfile.findByIdAndUpdate(review.expertId, {
      $pull: { reviews: review._id },
    });

    return { message: "Deleted review successfully" };
  };

  /**
   * Create a new complaint or suggestion
   */
  public createComplaintSuggestion = async (
    userId: Types.ObjectId,
    dto: CreateComplaintSuggestionDto,
    file?: Express.Multer.File
  ): Promise<{ message: string }> => {
    const { type, subject, message } = dto;
    let image;
    
if (file) {
    let uploadResult;
    if (file.path) {
      uploadResult = await CloudinaryService.uploadImage(
        file.path,
        CloudinaryFolders.Complaint_SUGGESTIONS
      );
    } 
    else if (file.buffer) {
      uploadResult = await CloudinaryService.uploadStreamFile(
        file.buffer,
        CloudinaryFolders.Complaint_SUGGESTIONS
      );
    } 
    else {
      throw new AppError("Invalid file upload", StatusCode.BAD_REQUEST);
    }
      image = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
    }
    await ComplaintSuggestion.create({
      userId,
      type,
      subject,
      message,
    ...(image && { image }),
    });

    return { message: "Created a new complaint/suggestion successfully" };
  };

  public getAllComplaints = async (dto: FindComplaintSuggestionDto) => {
    const { type, userId } = dto;
    const filter: any = {};
    if (type) filter.type = type;
    if (userId) filter.userId = new Types.ObjectId(userId);
    return ComplaintSuggestion.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
  };

  // public getByUser = async (userId: Types.ObjectId) => {
  //   return ComplaintSuggestion.find({ userId }).sort({ createdAt: -1 });
  // };
}

export default ReviewService;
