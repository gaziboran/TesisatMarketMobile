import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Tüm sipariş route'ları için authentication gerekli
router.use(authenticateToken);

// Sipariş oluştur
router.post('/', createOrder);

// Sipariş listesi
router.get('/', getUserOrders);

// Sipariş detayı
router.get('/:id', async (req, res) => {
    res.json({ message: 'Sipariş detayı gelecek' });
});

export default router; 