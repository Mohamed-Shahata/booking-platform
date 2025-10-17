import { UserModel , IUser} from "../Model/user.model";

export class UserEntity {
    private data: Partial<IUser>;

    constructor(userData: Partial<IUser>) {
        this.data = userData;
    }

    async save() {
        const user = new UserModel(this.data);
        return await user.save();
    }

    static async findByEmail(email:string) {
        return await UserModel.findOne({ email });
    }

}


