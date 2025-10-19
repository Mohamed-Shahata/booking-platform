import { StatusCode } from "../../shared/enums/statusCode.enum";
import AppError from "../../shared/errors/app.error";
import { UserError, ValidationError } from "../../utils/constant";
import mailService from "../Mail/mail.service";
import User from "../User/user.model";
import { IUser } from "../User/user.type";
import { VerifyEmailDto } from "./dto/register.dto";
import { RegisterDto } from "./dto/verifyEmail.dto";

class AuthService {
  /**
   * Registers a new user by creating an account, generating an OTP,
   * and sending a verification email.
   *
   * @param dto - The user registration data (email, username, gender, password)
   * @returns A success message indicating that an OTP has been sent
   */
  public register = async (dto: RegisterDto): Promise<{ message: string }> => {
    const { email, username, gender, password } = dto;

    const userExsits = await User.findOne({ email });

    if (userExsits)
      throw new AppError(UserError.USER_ALREADY_EXSITS, StatusCode.CONFLICT);

    // generate a new OTP
    const otp = this.generateOtp();

    // send otp to user email
    await mailService.sendVreficationEmail(email, username, otp);

    const user = await User.create({
      username,
      email,
      gender,
      password,
      verificationCode: otp,
      verificationCodeExpires: this.generateExpiryTime(5),
    });

    await user.save();

    return {
      message: "We sent a new otp of your email, check your email please",
    };
  };

  /**
   * Verifies user's email by checking the provided OTP code.
   *
   * @param dto - Email and OTP code for verification
   * @returns A success message upon successful verification
   */
  public verifyEmail = async (
    dto: VerifyEmailDto
  ): Promise<{ message: string }> => {
    const { email, code } = dto;

    const user = await this.findUserByEmail(email);

    if (user.isVerified && user.verificationCode === null)
      throw new AppError(
        UserError.USER_ACCOUNT_IS_VERIFIED,
        StatusCode.BAD_REQUEST
      );

    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    )
      throw new AppError(ValidationError.CODE_EXPIRED, StatusCode.BAD_REQUEST);

    if (user.verificationCode !== code)
      throw new AppError(ValidationError.CODE_IS_WRONG, StatusCode.BAD_GATEWAY);

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    return { message: "User created successfully" };
  };

  /**
   * Finds a user by email.
   * Throws an error if the user does not exist.
   *
   * @param email - The user's email
   * @returns The found user document
   */
  private findUserByEmail = async (email: string): Promise<IUser> => {
    const user = await User.findOne({ email });
    if (!user)
      throw new AppError(UserError.USER_NOT_FOUND, StatusCode.BAD_GATEWAY);
    return user;
  };

  /**
   * Generates a future timestamp for OTP expiration.
   *
   * @param minutes - Expiration time in minutes
   * @returns A Date object representing the expiry time
   */
  private generateExpiryTime = (minutes: number): Date => {
    return new Date(Date.now() + minutes * 60 * 1000);
  };

  /**
   * Generates a random numeric OTP code.
   *
   * @returns A 6 digit OTP as a string
   */
  private generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
}

export default AuthService;
