import express from 'express';
import { AuthController } from '../Controller/register.controller';

const router = express.Router();


router.post('/register', AuthController.register);

export default router;
