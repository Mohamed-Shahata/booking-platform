import {Router} from 'express';
import { AuthController } from './auth.controller';
import {AuthValidation} from '../dto/register.dto'
import {validate} from '../../Shared/validation/validate'


export class AuthRoutes {
    public route=Router()
    private controller=new AuthController()

    constructor (){
        this.initRoutes()
    }

    private initRoutes(){
        this.route.post('/register',validate(AuthValidation.registerSchema),this.controller.register)
    }
}


