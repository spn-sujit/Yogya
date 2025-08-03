import express from 'express';
import { getUserData, loginUser, registerUser } from '../controllers/UserController.js';
import protect from '../middleware/isUser.js';


const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/user',protect,getUserData);
export default router;
