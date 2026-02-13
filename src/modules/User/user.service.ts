import { Types } from "mongoose";
import User, { DEFAULT_AVATAR } from "../../DB/model/user.model";
import { GetAllUserDto } from "./dto/getAllUsers.dto";
import { IExpertProfile, IUser } from "./user.type";
import AppError from "../../shared/errors/app.error";
import {
  CloudinaryFolders,
  UserError,
  UserSuccess,
} from "../../shared/utils/constant";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { UpdateUserDto } from "./dto/updateUser.dto";
import CloudinaryService from "../../shared/services/cloudinary.service";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import ExpertProfile from "../../DB/model/expertProfile.model";
import { GetAllExpertDto } from "./dto/getAllExpert.dto";
import mailService from "../../shared/Mail/mail.service";
import { getPagination } from "../../shared/utils/pagination";
import { IReview } from "../Review/review.type";
import { GetOneExpertDto } from "./dto/getExpert.dto";

class UserService {
  constructor() {}

  /**
   * Get all verified users with pagination (for Flutter)
   *
   * This method retrieves all users that have verified their accounts.
   * Supports pagination using `page` and `limit` parameters.
   *
   * @param dto - The pagination data (page, limit)
   * @returns A list of verified users
   *
   * Example:
   *  page = 1, limit = 20 → skips 0 users and gets 20
   */
  public getAllUsers = async (dto: GetAllUserDto): Promise<Array<IUser>> => {
    const { page, limit } = dto;
    const { limitNumber, skip } = getPagination(page, limit);

    const users = await User.find({ isVerified: true })
      .select("username email avatar gender phone role isVerified")
      .limit(limitNumber)
      .skip(skip)
      .exec();

    return users;
  };

  /**
   * Get all experts with optional filters and pagination (for Flutter)
   *
   * Retrieves a paginated list of experts filtered by specialty, rate, and years of experience.
   * Populates the `userId` field to include basic user data (username, avatar).
   *
   * @param dto - The filter and pagination data (page, limit, specialty, rate, yearsOfExperience)
   * @returns A list of expert profiles matching the provided filters
   *
   * Example:
   *  page = 1, limit = 10, specialty = "Cardiology", rate = 4.5
   *  → returns up to 10 cardiologists with a 4.5 rating or higher
   */
  public getAllExpert = async (dto: GetAllExpertDto): Promise<Array<IUser>> => {
    const { page, limit, specialty, rateing, yearsOfExperience } = dto;
    const { limitNumber, skip } = getPagination(page, limit);

    const experts = await User.aggregate([
      {
        $match: {
          isVerified: true,
          role: UserRoles.EXPERT,
        },
      },
      {
        $lookup: {
          from: "expertprofiles",
          localField: "hasExpertProfile",
          foreignField: "_id",
          as: "expertProfile",
        },
      },
      {
        $unwind: "$expertProfile",
      },
      {
        $match: {
          ...(specialty && { "expertProfile.specialty": specialty }),
          ...(yearsOfExperience && {
            "expertProfile.yearsOfExperience": {
              $gte: Number(yearsOfExperience),
            },
          }),
          ...(rateing && {
            "expertProfile.rateing": { $gte: Number(rateing) },
          }),
        },
      },
      {
        $project: {
          username: 1,
          avatar: 1,
          "expertProfile.specialty": 1,
          "expertProfile.rateing": 1,
          "expertProfile.yearsOfExperience": 1,
          "expertProfile.bio": 1,
        },
      },
      { $skip: skip },
      { $limit: limitNumber },
    ]);

    return experts;
  };
  /**
   * Get verified experts with optional filters and pagination
   *
   * Retrieves a paginated list of verified experts filtered by specialty, username, and email.
   * Joins each expert with their corresponding expert profile to include additional data
   * such as specialty, rating, years of experience, and bio.
   *
   * @param dto - The query data containing optional filters and pagination parameters
   *              (page, limit, specialty, username, email)
   * @returns A paginated list of experts with their profile details
   *
   * Example:
   *  page = 1, limit = 10, specialty = "IT", username = "rashad"
   *  → returns up to 10 verified IT experts whose username matches "rashad"
   */
  public getExpert = async (dto: GetOneExpertDto): Promise<Array<IUser>> => {
    const { page, limit, specialty, username, email } = dto;
    const { limitNumber, skip } = getPagination(page, limit);

    const experts = await User.aggregate([
      {
        $match: {
          isVerified: true,
          role: UserRoles.EXPERT,
        },
      },
      {
        $lookup: {
          from: "expertprofiles",
          localField: "hasExpertProfile",
          foreignField: "_id",
          as: "expertProfile",
        },
      },
      { $unwind: "$expertProfile" },
      {
        $match: {
          ...(specialty && { "expertProfile.specialty": specialty }),
          ...(username && { username: { $regex: username, $options: "i" } }),
          ...(email && { email: { $regex: email, $options: "i" } }),
        },
      },
      {
        $project: {
          username: 1,
          avatar: 1,
          email: 1,
          "expertProfile.specialty": 1,
          "expertProfile.rateing": 1,
          "expertProfile.yearsOfExperience": 1,
          "expertProfile.bio": 1,
        },
      },
      { $skip: skip },
      { $limit: limitNumber },
    ]);

    return experts;
  };

  /**
   * Retrieves all expert users who are not verified.
   *
   * @returns {Promise<User[]>} List of unverified expert users.
   */
  public getAllExpertsIsNotverified = async (): Promise<IUser[]> => {
    const experts = await User.find({
      role: UserRoles.EXPERT,
      isVerified: false,
    })
      .select("-password")
      .populate("hasExpertProfile");
    return experts;
  };

  /**
   * Update user data by ID
   *
   * Finds a user by ID and updates their data with the provided body DTO.
   * If the user does not exist, throws a `USER_NOT_FOUND` error.
   *
   * @param id - The user's MongoDB ObjectId
   * @param bodyDto - The data to update
   * @param role - The role of person
   * @returns The updated user document
   */
  public update = async (
    id: Types.ObjectId,
    bodyDto: UpdateUserDto,
    role: UserRoles,
  ): Promise<IUser> => {
    const {
      username,
      aboutYou,
      bio,
      gender,
      phone,
      specialty,
      yearsOfExperience,
      location,
      nameWorked,
    } = bodyDto;
    let userUpdate: IUser | null;
    if (role === UserRoles.CLIENT) {
      userUpdate = await User.findByIdAndUpdate(
        id,
        { $set: { username, gender, phone } },
        { new: true },
      );
    } else if (role === UserRoles.EXPERT) {
      userUpdate = await ExpertProfile.findOneAndUpdate(
        { userId: id },
        {
          $set: {
            username,
            aboutYou,
            bio,
            gender,
            phone,
            specialty,
            yearsOfExperience,
            location,
            nameWorked,
          },
        },
        { new: true },
      );
    } else {
      throw new AppError("Role not found", StatusCode.NOT_FOUND);
    }

    if (!userUpdate)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);

    return userUpdate;
  };

  /**
   * Soft delete user account by ID
   *
   * Instead of permanently deleting the user, this method marks
   * the account as deleted and sets a `deletedAt` timestamp.
   * Displays a message that the account will be permanently deleted after 7 days.
   *
   * @param id - The user's MongoDB ObjectId
   * @returns A message about the scheduled deletion
   */
  public delete = async (id: Types.ObjectId): Promise<{ message: string }> => {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: { isDeleted: Date.now() },
      },
      { new: true },
    );
    if (!user)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return {
      message:
        UserSuccess.YOUR_ACCOUNT_HAS_BEEN_DEACTIVATED_AND_SCHEDULED_FOR_PERMANENT_DELETION_AFTER_7_DAYS_YOU_CAN_REACTIVATE_IT_ANYTIME_BY_LOGGING_IN_AGAIN_BEFORE_THAT_PERIOD,
    };
  };

  /**
   * Retrieves the authenticated user's data by ID.
   *
   * @param id - The user's ObjectId
   * @returns The user document
   */
  public getMe = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await this.getOneUser(id);
    return user;
  };

  /**
   * Retrieves a single user by ID.
   *
   * @param id - The user's ObjectId
   * @returns The user document
   */
  public getOne = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await this.getOneUser(id);
    return user;
  };

  /**
   * Retrieves the top 10 experts based on their rating in descending order.
   *
   * - Fetches all expert profiles from the database.
   * - Sorts them by the `rateing` field (highest first).
   * - Limits the result to 10 experts only.
   * - Populates the `userId` field to include user information related to each expert.
   *
   * @returns {Promise<IExpertProfile[]>} A promise that resolves to an array of the top 10 expert profiles.
   */
  public getTopTenExperts = async (): Promise<IExpertProfile[]> => {
    const experts = await ExpertProfile.find()
      .sort({ rateing: -1 })
      .limit(10)
      .populate("userId");
    return experts;
  };

  /**
   * Accept a user's verification request
   *
   * Updates the specified user's account by setting `isVerified` to true.
   *
   * @param userId - The ObjectId of the user to verify
   * @returns A success message if the user was updated
   */
  public acceptRequest = async (
    userId: Types.ObjectId,
  ): Promise<{ message: string }> => {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { isVerified: true } },
      { new: true },
    );
    if (!user) {
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (user.verificationCode) {
      throw new AppError(
        UserError.USER_ACCOUNT_IS_NOT_VERIFIED_CODE,
        StatusCode.BAD_REQUEST,
      );
    }

    mailService.verifyAcceptEmail(user.email, user.username);
    return { message: "Accepted Successfully" };
  };

  /**
   * Reject a user's verification request
   *
   * Sends a rejection email to the user, deletes their expert profile,
   * and removes their account from the database.
   *
   * @param userId - The ObjectId of the user to reject
   * @returns A success message after rejection and cleanup
   */
  public rejectRequest = async (
    userId: Types.ObjectId,
  ): Promise<{ message: string }> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (user.verificationCode) {
      throw new AppError(
        UserError.USER_ACCOUNT_IS_NOT_VERIFIED_CODE,
        StatusCode.BAD_REQUEST,
      );
    }

    const expertProfile = await ExpertProfile.findOne({ userId });
    if (expertProfile) {
      await ExpertProfile.deleteOne({ _id: expertProfile._id });
    }
    await User.deleteOne({ _id: userId });

    mailService.verifyRejectEmail(user.email, user.username);

    return { message: "Rejected Successfully and user deleted" };
  };

  /**
   * Updates the expert's CV file.
   * - Deletes the old CV from Cloudinary.
   * - Uploads the new CV.
   * - Updates the user's expert profile with the new CV details.
   *
   * @param {Types.ObjectId} userId - The user's ObjectId.
   * @param {Express.Multer.File} file - The uploaded CV file.
   * @returns {Promise<{ message: string }>} Success message.
   */
  public updatedCv = async (
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<{ message: string }> => {
    const userExpertProfile = await this.getOneExpertProfile(userId);

    await CloudinaryService.deleteImageOrFile(userExpertProfile.cv.publicId);
    const uploadResult = await CloudinaryService.uploadStreamFile(
      file.buffer,
      CloudinaryFolders.CVS,
    );
    await ExpertProfile.updateOne(
      { _id: userId },
      {
        cv: {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
        },
      },
    );

    return { message: UserSuccess.UPDATED_USER_EXPERT_PROFILE_SUCCESSFULLY };
  };

  /**
   * Uploads a new avatar to Cloudinary and updates the user's avatar field.
   * If the user already has an avatar, the old one is deleted first.
   *
   * @param userId - The user's ObjectId
   * @param file - The local path of the image to upload
   * @returns A success message
   */
  public uploadAndUpdateAvatar = async (
    userId: Types.ObjectId,
    file: string,
  ): Promise<{ message: string }> => {
    const user = await this.getOneUser(userId);

    if (!user.avatar?.publicId) {
      const uploadResult = await CloudinaryService.uploadImage(
        file,
        CloudinaryFolders.AVATARS,
      );
      await User.updateOne(
        { _id: userId },
        {
          avatar: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
          },
        },
      );
    } else {
      await CloudinaryService.deleteImageOrFile(user.avatar?.publicId!);
      const uploadResult = await CloudinaryService.uploadImage(
        file,
        CloudinaryFolders.AVATARS,
      );
      await User.updateOne(
        { _id: userId },
        {
          avatar: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
          },
        },
      );
    }

    return { message: UserSuccess.UPDATED_USER_SUCCESSFULLY };
  };

  /**
   * Deletes the user's avatar from Cloudinary and clears the avatar field in the database.
   *
   * @param userId - The user's ObjectId
   * @returns A success message
   */
  public deleteAvatar = async (
    userId: Types.ObjectId,
  ): Promise<{ message: string }> => {
    const user = await this.getOneUser(userId);

    await CloudinaryService.deleteImageOrFile(user.avatar?.publicId!);

    await User.updateOne(
      { _id: userId },
      {
        avatar: {
          url: DEFAULT_AVATAR.url,
          publicId: DEFAULT_AVATAR.publicId,
        },
      },
    );

    return { message: UserSuccess.DELETED_AVATAR_SUCCESSFULLY };
  };

  /**
   * Get single user by ID (private method)
   *
   * Fetches one user from the database using their ID.
   * Throws an error if the user cannot be found.
   *
   * @param id - The user's MongoDB ObjectId
   * @returns The found user document
   */
  private getOneUser = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await User.findById(id).populate("hasExpertProfile");
    if (!user)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  };

  /**
   * Fetches a single expert profile by user ID.
   * @param {Types.ObjectId} id - The user's ObjectId.
   * @returns {Promise<IExpertProfile>} The expert profile document.
   * @throws {AppError} If no profile is found.
   */
  private getOneExpertProfile = async (
    id: Types.ObjectId,
  ): Promise<IExpertProfile> => {
    const expertProfile = await ExpertProfile.findOne({ userId: id });
    if (!expertProfile)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return expertProfile;
  };
}
export default UserService;
