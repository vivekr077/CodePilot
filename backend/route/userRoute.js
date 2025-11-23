import express from 'express'
import { createUserController, loginController } from '../controller/userController.js';
const userRoute = express.Router();

userRoute.post('/signUp', createUserController);
userRoute.post('/logIn', loginController);

export default userRoute;



