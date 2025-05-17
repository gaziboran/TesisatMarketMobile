import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Ürün listesi
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu.' });
    }
});

// Ürün detayı
router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                category: true
            }
        });
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ürün detayı getirilirken bir hata oluştu.' });
    }
});

export default router; 