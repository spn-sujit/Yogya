import express from 'express';
import upload from '../config/multer.js';
import { createSession, deleteSession, getAllSessions, getSessionsById, toggleLike, updateSession } from '../controllers/SessionController.js';
import protect from '../middleware/isUser.js';

const router = express.Router();


router.post('/create',protect,upload.single('file'),createSession);

router.get('/',getAllSessions);

router.get('/:id',getSessionsById);

router.post('/:sessionId/like',protect,toggleLike);

router.put("/:id", protect,upload.single('file') ,updateSession);

router.delete("/:id", protect, deleteSession);




export default router;