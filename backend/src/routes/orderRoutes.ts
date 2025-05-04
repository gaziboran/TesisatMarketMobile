import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Sipariş oluştur
router.post('/', authenticateToken, async (req, res) => {
    res.json({ message: 'Sipariş oluşturulacak' });
});

// Sipariş listesi
router.get('/', authenticateToken, async (req, res) => {
    res.json({ message: 'Sipariş listesi gelecek' });
});

// Sipariş detayı
router.get('/:id', authenticateToken, async (req, res) => {
    res.json({ message: 'Sipariş detayı gelecek' });
});

export default router; 