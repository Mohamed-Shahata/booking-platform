import { Request, Response } from "express";
import sendResponse from "../../shared/utils/sendResponse";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import AuthService from "./auth.service";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * dto is => Validation data is {username, email, password, gender}
   * POST ~/auth/register
   *
   * example
   * {
   *  username: "ex_username",
   *  email: "ex_email@gmail.com",
   *  password: "ex_password123",
   *  gender: "male"
   * }
   */
  public register = async (req: Request, res: Response) => {
    const dto = req.body;
    const { message } = await this.authService.register(dto);
    sendResponse(res, StatusCode.OK, { success: true, data: { message } });
  };

  /**
   * dto is => Validation data is {email , code}
   * POST ~/auth/verify
   *
   * example
   * {
   *  email: "ex_email@gmail.com",
   *  code: "xxxxxx" => 6 digits
   * }
   */
  public verifyEmail = async (req: Request, res: Response) => {
    const dto = req.body;
    const { message } = await this.authService.verifyEmail(dto);
    sendResponse(res, StatusCode.OK, { data: { message }, success: true });
  };

  /**
   * dto is => Validation data is {email , password}
   * POST ~/auth/login
   *
   * example
   * {
   *  email: "ex_email@gmail.com",
   *  password: "12345678" => min length must be 8 digits
   * }
   */
  public login = async (req: Request, res: Response) => {
    const dto = req.body;
    const { user, accessToken } = await this.authService.login(dto);

    sendResponse(res, StatusCode.OK, {
      data: { user, accessToken },
      success: true,
    });
  };
  /**
   * dto is => Validation data is {email ,code, password}
   * POST ~/auth/restPassword
   *
   * example
   * {
   *  email: "ex_email@gmail.com",
   *  password: "12345678" => min length must be 8 digits
   * code:"123456"=> min length must be 6 digits
   * }
   */
  public restPassword = async (req: Request, res: Response) => {
    const dto = req.body;
    const { message } = await this.authService.restPassword(dto);

    sendResponse(res, StatusCode.OK, {
      data: { message },
      success: true,
    });
  };

  /**
   * dto is => Validation data is {email}
   * POST ~/auth/forgetPassword
   *
   * example
   * {
   *  email: "ex_email@gmail.com",
   * }
   */
  public forgetPassword = async (req: Request, res: Response) => {
    const dto = req.body;
    const { message } = await this.authService.forgetPassword(dto);
    sendResponse(res, StatusCode.OK, {
      data: { message },
      success: true,
    });
  };
  /**
   * dto is => Validation data is {email}
   * POST ~/auth/forgetPassword
   *
   * example
   * {
   *  email: "ex_email@gmail.com",
   * }
   */

  public resendCode = async (req: Request, res: Response) => {
    const dto = req.body;
    const { message } = await this.authService.resendCode(dto);
    sendResponse(res, StatusCode.OK, {
      data: { message },
      success: true,
    });
  };
}

export default AuthController;
