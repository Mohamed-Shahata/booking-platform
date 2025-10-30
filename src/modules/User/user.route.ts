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
import {
  uploadFile,
  uploadImage,
} from "../../shared/middlewares/multer.middleware";
import { getAllExpertSchema } from "./dto/getAllExpert.dto";

class UserRouter {
  router = Router();
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.initRoutes();
  }

  private initRoutes() {
    // Get ~/users/topTenExperts
    this.router.get(
      "/topTenExperts",
      expressAsyncHandler(this.userController.getTopTenExperts)
    );

    // Get ~/users
    this.router.get(
      "/",
      validate(getAllUserSchema),
      auth,
      authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.gelAllUsers)
    );

    // Get ~/users/experts
    this.router.get(
      "/experts",
      validate(getAllExpertSchema),
      auth,
      authRoles(UserRoles.CLIENT, UserRoles.ADMIN),
      expressAsyncHandler(this.userController.gelAllExperts)
    );

    // Get ~/users/verify/experts
    this.router.get(
      "/not-verify/experts",
      auth,
      authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.getAllExpertsIsNotverified)
    );

    // Get ~/users/me
    this.router.get(
      "/me",
      auth,
      expressAsyncHandler(this.userController.getMe)
    );

    // Get ~/users/userId
    this.router.get(
      "/:userId",
      auth,
      expressAsyncHandler(this.userController.getOne)
    );

    // Get ~/users/topTenExperts
    this.router.get(
      "/topTenExperts",
      expressAsyncHandler(this.userController.getTopTenExperts)
    );

    // Patch ~/users/accept/userId
    this.router.patch(
      "/accept/:userId",
      auth,
      authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.acceptRequest)
    );

    // Delete ~/users/reject/userId
    this.router.delete(
      "/reject/:userId",
      auth,
      authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.rejectRequest)
    );

    // Patch ~/users
    this.router.patch(
      "/",
      validate(updateUserSchema),
      auth,
      isAccount,
      expressAsyncHandler(this.userController.update)
    );

    // Delete ~/users
    this.router.delete(
      "/",
      auth,
      isAccount,
      expressAsyncHandler(this.userController.delete)
    );

    // Post ~/users/upload-cv
    this.router.post(
      "/upload-cv",
      auth,
      uploadFile.single("cv"),
      expressAsyncHandler(this.userController.updateCv)
    );

    // Post ~/users/upload-avatar
    this.router.post(
      "/upload-avatar",
      auth,
      uploadImage.single("avatar"),
      expressAsyncHandler(this.userController.uploadAndUpdateAvatar)
    );

    // Delete ~/users/delete-avatar
    this.router.delete(
      "/delete-avatar",
      auth,
      expressAsyncHandler(this.userController.deletedAvatar)
    );
  }
}

export default UserRouter;
