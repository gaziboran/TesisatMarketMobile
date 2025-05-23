import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createRequest, getUserRequests, updateRequestStatus, updateRequestRatingAndComment, getAllRequests } from '../controllers/plumberRequestController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Multer ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/plumber-requests');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('image'), createRequest);
router.get('/user/:userId', authenticateToken, getUserRequests);
router.patch('/:id/status', authenticateToken, updateRequestStatus);
router.patch('/:id/rating-comment', authenticateToken, updateRequestRatingAndComment);
router.get('/all', authenticateToken, getAllRequests);

export default router; 