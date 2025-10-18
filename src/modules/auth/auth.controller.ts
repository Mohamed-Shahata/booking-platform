import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import AuthService from "./auth.service";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response) => {
    const dto = req.body;

    const { message } = await this.authService.register(dto);

    sendResponse(res, StatusCode.OK, { success: true, data: { message } });
  };
}

export default AuthController;
