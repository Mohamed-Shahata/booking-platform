import {Router} from 'express';
import { AuthController } from './auth.controller';
import {AuthValidation} from '../dto/register.dto'
import {Validator} from '../../Shared/validation/register.validated'


const validation = new Validator(AuthValidation.registerSchema);


export class AuthRoutes {
    public route=Router()
    private controller=new AuthController()

    constructor (){
        this.initRoutes()
    }

    private initRoutes(){
        this.route.post('/register',validation.validate,this.controller.register)
    }
}


