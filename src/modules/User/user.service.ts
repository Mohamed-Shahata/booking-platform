import { Types } from "mongoose";
import User from "../../DB/model/user.model";
import { GetAllUserDto } from "./dto/getAllUsers.dto";
import { IUser } from "./user.type";
import AppError from "../../shared/errors/app.error";
import { UserError } from "../../shared/utils/constant";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { UpdateUserDto } from "./dto/updateUser.dto";

class UserService {
  constructor() {}

  /**
   * Get all users with pagination flutter
   * @param dto The flutter data (page, limit)
   * @returns users
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
   * update user by id
   * @param id user id
   * @param bodyDto you data to need updated it
   * @returns user after updated
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
   * get one user in data base
   * @param id user id
   * @returns user or AppError with (message User not found)
   */
  private getOne = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await User.findById(id);
    if (!user)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  };
}
export default UserService;
