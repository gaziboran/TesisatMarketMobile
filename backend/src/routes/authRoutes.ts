import express from 'express';
import { registerUser, loginUser, updateUserProfile, changePassword, getAllUsers } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', authenticateToken, updateUserProfile);
router.put('/change-password', authenticateToken, changePassword);
router.get('/users', authenticateToken, getAllUsers);

export default router; 