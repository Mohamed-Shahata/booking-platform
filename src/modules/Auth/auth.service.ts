import User from "../../DB/model/user.model";
import { StatusCode } from "../../shared/enums/statusCode.enum";
import AppError from "../../shared/errors/app.error";
import {
  CloudinaryFolders,
  UserError,
  ValidationError,
} from "../../shared/utils/constant";
import { generateAccessToken } from "../../shared/utils/generateTokens";
import mailService from "../../shared/Mail/mail.service";
import { IUser } from "../User/user.type";
import { LoginDto } from "./dto/login.dto";
import { RegisterClientDto } from "./dto/registerClient.dto";
import { VerifyEmailDto } from "./dto/verifyEmail.dto";
import { restPasswordDto } from "./dto/restPassword.dto";
import { forgetPasswordDto } from "./dto/forgetPassword.dto";
import { resendCodeDto } from "./dto/resendCode.dto";
import { RegisterExpertDto } from "./dto/registerExpert.dto";
import ExpertProfile from "../../DB/model/expertProfile.model";
import CloudinaryService from "../../shared/services/cloudinary.service";
import { UserRoles } from "../../shared/enums/UserRoles.enum";

class AuthService {
  /**
   * Registers a new user client by creating an account, generating an OTP,
   * and sending a verification email.
   *
   * @param dto - The user registration data (email, username, gender, password)
   * @returns A success message indicating that an OTP has been sent
   */
  public registerClient = async (
    dto: RegisterClientDto
  ): Promise<{ message: string }> => {
    const { email, username, gender, password, phone } = dto;

    const userExsits = await User.findOne({ email });

    if (userExsits)
      throw new AppError(UserError.USER_ALREADY_EXSITS, StatusCode.CONFLICT);

    // generate a new OTP
    const otp = this.generateOtp();

    const user = await User.create({
      username,
      email,
      gender,
      password,
      phone,
      verificationCode: otp,
      verificationCodeExpires: this.generateExpiryTime(5),
    });

    // send otp to user email
    await mailService.sendVreficationEmail(email, username, otp);

    return {
      message: "We sent a new otp of your email, check your email please",
    };
  };

  /**
   * Registers a new user expert by creating an account, generating an OTP,
   * and sending a verification email.
   *
   * @param dto - The user registration data (email, username, gender, password, aboutYou, specialty, yearsOfExperience)
   * @returns A success message indicating that an OTP has been sent
   */
  public registerExpert = async (
    dto: RegisterExpertDto,
    cvFile: Express.Multer.File
  ): Promise<{ message: string }> => {
    const {
      email,
      username,
      gender,
      password,
      phone,
      aboutYou,
      specialty,
      yearsOfExperience,
    } = dto;

    const userExsits = await User.findOne({ email });

    if (userExsits)
      throw new AppError(UserError.USER_ALREADY_EXSITS, StatusCode.CONFLICT);

    // generate a new OTP
    const otp = this.generateOtp();

    const user = await User.create({
      username,
      email,
      gender,
      password,
      phone,
      role: UserRoles.EXPERT,
      verificationCode: otp,
      verificationCodeExpires: this.generateExpiryTime(5),
    });

    // upload cv file on cloudinary
    const cvUploadedFile = await CloudinaryService.uploadStreamFile(
      cvFile.buffer,
      CloudinaryFolders.CVS
    );

    // create a expert profile
    await ExpertProfile.create({
      userId: user._id,
      specialty,
      aboutYou,
      yearsOfExperience,
      cv: {
        url: cvUploadedFile.url,
        publicId: cvUploadedFile.publicId,
      },
    });

    // send otp to user email
    await mailService.sendVreficationEmail(email, username, otp);

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
      throw new AppError(ValidationError.CODE_IS_WRONG, StatusCode.BAD_REQUEST);

    await user.updateOne({
      isVerified: true,
      $unset: {
        verificationCode: 0,
        verificationCodeExpires: 0,
        resetPasswordToken: 0,
        resetPasswordExpire: 0,
        otpSentAt: 0,
      },
    });

    return { message: "User created successfully" };
  };

  /**
   * Authenticates a user by validating email and password.
   * If successful, returns the user data along with an access token.
   *
   * @param dto - Login credentials (email and password)
   * @returns Authenticated user and generated access token
   */
  public login = async (
    dto: LoginDto
  ): Promise<{ user: IUser; accessToken: string }> => {
    const { email, password } = dto;
    const user = await this.findUserByEmail(
      email,
      ValidationError.EMAIL_OR_PASSWORD_IS_WRONG,
      true
    );

    if (!user.isVerified)
      throw new AppError(
        UserError.USER_ACCOUNT_IS_NOT_VERIFIED,
        StatusCode.BAD_REQUEST
      );

    // check account is deleted or no
    if (user.isDeleted) {
      const daysSinceDelete = user.deletedAt
        ? (Date.now() - user.deletedAt.getTime()) / (1000 * 60 * 60 * 24)
        : 0;

      if (daysSinceDelete < 7) {
        user.isDeleted = false;
        user.deletedAt = null;
        await user.save();
      }
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      throw new AppError(
        ValidationError.EMAIL_OR_PASSWORD_IS_WRONG,
        StatusCode.BAD_REQUEST
      );

    // generate a new access token
    const accessToken = generateAccessToken({ id: user._id, role: user.role });

    return { user, accessToken };
  };

  /**
   * Verifies user's email by checking the provided OTP code.
   *
   * @param dto - Email verification
   * @returns A success message upon successful send code
   */
  public forgetPassword = async (
    dto: forgetPasswordDto
  ): Promise<{ message: string }> => {
    const { email } = dto;
    const user = await this.findUserByEmail(
      email,
      ValidationError.EMAIL_OR_PASSWORD_IS_WRONG,
      true
    );
    if (!user.isVerified)
      throw new AppError(
        UserError.USER_ACCOUNT_IS_NOT_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    // generate a new OTP
    const otp = this.generateOtp();
    // send otp to user email
    await mailService.sendRestPassword(email, user.username, otp);
    await user.updateOne({
      verificationCode: otp,
      verificationCodeExpires: this.generateExpiryTime(5),
    });
    return { message: "Done" };
  };

  /**
   * Verifies user's email by checking the provided OTP code.
   *
   * @param dto - Email and OTP code and password for verification
   * @returns A success message upon password was changed
   */
  public restPassword = async (
    dto: restPasswordDto
  ): Promise<{ message: string }> => {
    const { email, code, password } = dto;
    const user = await this.findUserByEmail(
      email,
      ValidationError.EMAIL_OR_PASSWORD_IS_WRONG,
      true
    );
    if (!user.isVerified)
      throw new AppError(
        UserError.USER_ACCOUNT_IS_NOT_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    )
      throw new AppError(ValidationError.CODE_EXPIRED, StatusCode.BAD_REQUEST);
    // check the otp = code
    if (user.verificationCode !== code)
      throw new AppError(ValidationError.CODE_IS_WRONG, StatusCode.BAD_REQUEST);
    await user.updateOne({
      password,
      isVerified: true,
      chanageCridentialsTime: Date.now(),
      $unset: {
        verificationCode: 0,
        verificationCodeExpires: 0,
        resetPasswordToken: 0,
        resetPasswordExpire: 0,
        otpSentAt: 0,
      },
    });
    return { message: "Done" };
  };

  /**
   * Resends a new verification code (OTP) to the user's email.
   *
   * This method:
   * 1. Finds the user by their email.
   * 2. Checks if the user account is verified.
   * 3. Generates a new OTP code.
   * 4. Sends the OTP to the user's email.
   * 5. Updates the user's record with the new OTP, its expiry time, and the timestamp when it was sent.
   *
   * @param {resendCodeDto} dto - The data transfer object containing the user's email.
   * @returns {Promise<{ message: string }>} A confirmation message indicating that the operation was completed.
   *
   * @throws {AppError} If the user is not verified or the email does not exist.
   */
  public resendCode = async (
    dto: resendCodeDto
  ): Promise<{ message: string }> => {
    const { email } = dto;
    // 1. Find the user by email
    const user = await this.findUserByEmail(
      email,
      ValidationError.EMAIL_OR_PASSWORD_IS_WRONG,
      true
    );

    // 2. Check if the user is verified
    // if (!user.isVerified)
    //   throw new AppError(
    //     UserError.USER_ACCOUNT_IS_NOT_VERIFIED,
    //     StatusCode.BAD_REQUEST
    //   );

    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    // 3. Check if a code was sent recently
    if (user.otpSentAt) {
      const diff = now - new Date(user.otpSentAt).getTime();

      if (diff < FIVE_MINUTES) {
        const remaining = Math.ceil((FIVE_MINUTES - diff) / 1000 / 60);
        throw new AppError(
          `Please wait ${remaining} minute(s) before requesting another code.`,
          StatusCode.BAD_REQUEST
        );
      }
    }

    // 4. Generate a new OTP
    const otp = this.generateOtp();

    // 5. Send the OTP to the user's email
    await mailService.sendRestPassword(email, user.username, otp);

    // 6. Update the user with the new OTP, expiry time, and sent time
    await user.updateOne({
      verificationCode: otp,
      verificationCodeExpires: this.generateExpiryTime(5),
      otpSentAt: new Date(),
    });

    // 7. Return a success message
    return { message: "Verification code resent successfully" };
  };

  /**
   * Finds a user by email with optional validation message and password selection.
   *
   * @param email - The email address of the user to search for
   * @param messageValidation - (Optional) Custom error message if user is not found
   * @param selectPassword - (Optional) Whether to include the user's password field in the result
   *
   * @returns The user document if found
   * @throws AppError if the user does not exist
   */
  private findUserByEmail = async (
    email: string,
    messageValidation?: string,
    selectPassword: boolean = false
  ): Promise<IUser> => {
    const selectPass = "+password";
    const notSelectPass = "-password";
    const user = await User.findOne({ email }).select(
      selectPassword ? selectPass : notSelectPass
    );
    if (!user)
      throw new AppError(
        messageValidation || UserError.USER_NOT_FOUND,
        StatusCode.BAD_REQUEST
      );
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
