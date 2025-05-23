import express from 'express';
import { getComments, addComment, getAllComments, deleteComment, updateComment } from '../controllers/commentController';

const router = express.Router();

router.get('/', getComments);
router.post('/', addComment);
router.get('/all', getAllComments);
router.delete('/:id', deleteComment);
router.patch('/:id', updateComment);

export default router; 