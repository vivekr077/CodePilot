import express from 'express'
import { isLoggedIn } from '../middleware/verifyPassword.js';
import { generateCodeController } from '../controller/AiController.js';

const codeRoute = express.Router();

codeRoute.post('/generate-code', isLoggedIn, generateCodeController);

export default codeRoute;