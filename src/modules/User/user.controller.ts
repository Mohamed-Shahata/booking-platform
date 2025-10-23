import { Request, Response } from "express";
import UserService from "./user.service";
import sendResponse from "../../shared/utils/sendResponse";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { Types } from "mongoose";
import { UserSuccess } from "../../shared/utils/constant";
import { CustomRequest } from "../../shared/middlewares/auth.middleware";
import AppError from "../../shared/errors/app.error";
import CloudinaryService from "../../shared/services/cloudinary.service";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET ~/users?page=1&limit=20
  public gelAllUsers = async (req: Request, res: Response) => {
    const dto = req.query;

    const users = await this.userService.getAllUsers(dto);

    sendResponse(res, StatusCode.OK, {
      data: users,
      success: true,
      message: UserSuccess.GET_ALL_USERS_DONE,
    });
  };

  /**
   * dto is => Validation data is {username, phone, gender}
   * PATCH ~/users
   *
   * example
   * {
   *  username: "ex_username",
   *  phone: "ex_01" => min length must be 11 digits,
   *  gender: "ex_other"
   * }
   */
  public update = async (req: CustomRequest, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id);
    const dto = req.body;

    const user = await this.userService.update(userId, dto);

    sendResponse(res, StatusCode.OK, {
      data: user,
      success: true,
      message: UserSuccess.UPDATED_USER_SUCCESSFULLY,
    });
  };

  // DELETE ~/users
  public delete = async (req: CustomRequest, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id);

    const { message } = await this.userService.delete(userId);

    sendResponse(res, StatusCode.OK, {
      success: true,
      message: message,
    });
  };

  // GET ~/users/:userId
  public getOne = async (req: Request, res: Response) => {
    const userId = new Types.ObjectId(req.params.userId);

    const user = await this.userService.getOne(userId);

    sendResponse(res, StatusCode.OK, {
      data: { user },
      success: true,
      message: "Done",
    });
  };

  // GET ~/users/me
  public getMe = async (req: CustomRequest, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id);

    const user = await this.userService.getMe(userId);

    sendResponse(res, StatusCode.OK, {
      data: { user },
      success: true,
      message: "Done",
    });
  };

  // POST ~/users/upload-avatar
  public uploadAndUpdateAvatar = async (req: CustomRequest, res: Response) => {
    const file = req.file;
    const userId = new Types.ObjectId(req.user?.id);

    if (!file) throw new AppError("No file uploaded", StatusCode.BAD_REQUEST);

    const { message } = await this.userService.uploadAndUpdateAvatar(
      userId,
      file.path
    );

    sendResponse(res, StatusCode.OK, { success: true, message });
  };
  // DELETE ~/users/delete-avatar
  public deletedAvatar = async (req: CustomRequest, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id);

    const { message } = await this.userService.deleteAvatar(userId);

    sendResponse(res, StatusCode.OK, { success: true, message });
  };
}

export default UserController;
