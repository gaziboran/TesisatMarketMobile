import express from 'express';
import { addToCart, removeFromCart, getCart, updateCartItem } from '../controllers/cartController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Sepeti listele (örnek: userId=1)
router.get('/:userId', getCart);

// Sepete ürün ekle
router.post('/', addToCart);

// Sepetten ürün sil
router.delete('/:id', removeFromCart);

// Sepet miktarını güncelle
router.patch('/:id', authenticateToken, updateCartItem);

export default router; 