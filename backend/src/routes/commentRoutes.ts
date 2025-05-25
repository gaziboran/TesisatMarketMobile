import express from 'express';
import { getComments, addComment, getAllComments, deleteComment, updateComment, addAdminReply } from '../controllers/commentController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getComments);
router.post('/', addComment);
router.get('/all', getAllComments);
router.delete('/:id', deleteComment);
router.patch('/:id', updateComment);
router.patch('/:id/admin-reply', requireAdmin, addAdminReply);

export default router; 