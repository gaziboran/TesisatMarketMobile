import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Sepeti görüntüle
router.get('/', authenticateToken, async (req, res) => {
    res.json({ message: 'Sepet içeriği gelecek' });
});

// Sepete ürün ekle
router.post('/add', authenticateToken, async (req, res) => {
    res.json({ message: 'Ürün sepete eklenecek' });
});

// Sepetten ürün çıkar
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
    res.json({ message: 'Ürün sepetten çıkarılacak' });
});

export default router; 