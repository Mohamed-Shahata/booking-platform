import {UserModel , IUser} from './user.model'

export class UserService {
    private data:Partial<IUser>

    constructor(data:Partial<IUser>){
        this.data=data
    }

    public async createUser(){
        let newUser =await UserModel.create(this.data)
        return newUser
    }

    static async findUser(email:string){
        let user= await UserModel.findOne({email})
        return user
    }
}