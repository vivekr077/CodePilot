import express from 'express'
import { isLoggedIn } from '../middleware/verifyPassword.js';
import { codeHistoryController, generateCodeController } from '../controller/AiController.js';

const codeRoute = express.Router();

codeRoute.post('/generate', isLoggedIn, generateCodeController);
codeRoute.get('/history', isLoggedIn, codeHistoryController)

export default codeRoute;