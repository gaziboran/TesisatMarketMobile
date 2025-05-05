import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Tüm kategorileri getir
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        image: true,
        slug: true
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Kategori çekme hatası:', error);
    res.status(500).json({ message: 'Kategoriler alınamadı' });
  }
});

export default router; 