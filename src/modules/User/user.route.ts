import { Router } from "express";
import UserController from "./user.controller";
import expressAsyncHandler from "express-async-handler";
import validate from "../../shared/middlewares/validation.middleware";
import { getAllUserSchema } from "./dto/getAllUsers.dto";
import {
  auth,
  authRoles,
  isAccount,
} from "../../shared/middlewares/auth.middleware";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import { updateUserSchema } from "./dto/updateUser.dto";

class UserRouter {
  router = Router();
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      "/",
      validate(getAllUserSchema),
      auth,
      authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.gelAllUsers)
    );

    this.router.patch(
      "/",
      validate(updateUserSchema),
      auth,
      isAccount,
      expressAsyncHandler(this.userController.update)
    );

    this.router.delete(
      "/",
      auth,
      isAccount,
      expressAsyncHandler(this.userController.delete)
    );
  }
}

export default UserRouter;
