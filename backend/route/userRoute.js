import express from 'express'
import { createUserController, loginController } from '../controller/userController.js';
const userRoute = express.Router();

userRoute.post('/create-user', createUserController);
userRoute.get('/verify-password', loginController);

export default userRoute;



