import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Ürün listesi
router.get('/', async (req, res) => {
    res.json({ message: 'Ürün listesi gelecek' });
});

// Ürün detayı
router.get('/:id', async (req, res) => {
    res.json({ message: 'Ürün detayı gelecek' });
});

export default router; 