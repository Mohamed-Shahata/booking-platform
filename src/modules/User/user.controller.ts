import { Request, Response } from "express";
import UserService from "./user.service";
import sendResponse from "../../shared/utils/sendResponse";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import { Types } from "mongoose";
import { UserSuccess } from "../../shared/utils/constant";
import { CustomRequest } from "../../shared/middlewares/auth.middleware";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Get ~/users?page=1&limit=20
  public gelAllUsers = async (req: Request, res: Response) => {
    const dto = req.query;

    const users = await this.userService.getAllUsers(dto);

    sendResponse(res, StatusCode.OK, {
      data: users,
      success: true,
      message: UserSuccess.GET_ALL_USERS_DONE,
    });
  };

  // Put ~/users?page=1&limit=20
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
}

export default UserController;
