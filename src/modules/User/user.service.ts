import { Types } from "mongoose";
import User from "../../DB/model/user.model";
import { GetAllUserDto } from "./dto/getAllUsers.dto";
import { IUser } from "./user.type";
import AppError from "../../shared/errors/app.error";
import { UserError, UserSuccess } from "../../shared/utils/constant";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { UpdateUserDto } from "./dto/updateUser.dto";

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

    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 20;
    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find({ isVerified: true })
      .select("+username +email +image +gender +phone")
      .limit(limitNumber)
      .skip(skip)
      .exec();

    return users;
  };

  /**
   * Update user data by ID
   *
   * Finds a user by ID and updates their data with the provided body DTO.
   * If the user does not exist, throws a `USER_NOT_FOUND` error.
   *
   * @param id - The user's MongoDB ObjectId
   * @param bodyDto - The data to update
   * @returns The updated user document
   */
  public update = async (
    id: Types.ObjectId,
    bodyDto: UpdateUserDto
  ): Promise<IUser> => {
    const user = await User.findByIdAndUpdate(id, bodyDto, { new: true });

    if (!user)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
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
    const user = await User.findByIdAndUpdate(id, {
      $set: { isDeleted: true, deletedAt: new Date() },
    });

    if (!user)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return {
      message:
        UserSuccess.YOUR_ACCOUNT_HAS_BEEN_DEACTIVATED_AND_SCHEDULED_FOR_PERMANENT_DELETION_AFTER_7_DAYS_YOU_CAN_REACTIVATE_IT_ANYTIME_BY_LOGGING_IN_AGAIN_BEFORE_THAT_PERIOD,
    };
  };

  public getMe = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await this.getOneUser(id);
    return user;
  };

  public getOne = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await this.getOneUser(id);
    return user;
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
    const user = await User.findById(id);
    if (!user)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  };
}
export default UserService;
