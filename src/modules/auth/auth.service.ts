import { StatusCode } from "../../shared/enums/statusCode.enum";
import AppError from "../../shared/errors/app.error";
import User from "../User/user.model";
import { RegisterDto } from "./dto/register.dto";

class AuthService {
  public register = async (dto: RegisterDto): Promise<{ message: string }> => {
    const { email, username, gender, password } = dto;

    const userExsits = await User.findOne({ email });

    // note: change status to 409 exsits
    if (userExsits)
      throw new AppError("User already exsits", StatusCode.BAD_REQUEST);

    const user = await User.create({
      email,
      username,
      gender,
      password,
    });

    await user.save();

    return {
      message: "We sent a new otp of your email, check your email please",
    };
  };
}

export default AuthService;
