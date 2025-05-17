import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// Tüm kategorileri getir
router.get('/', async (req, res) => {
  try {
    console.log('Kategoriler getiriliyor...');
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        icon: true,
        products: true
      }
    });

    console.log('Bulunan kategoriler:', categories);

    // Görsel yollarını olduğu gibi bırak
    const categoriesWithImages = categories.map(category => ({
      ...category,
      image: category.image
    }));

    console.log('İşlenmiş kategoriler:', categoriesWithImages);
    res.json(categoriesWithImages);
  } catch (error) {
    console.error('Kategori getirme hatası:', error);
    res.status(500).json({ error: 'Kategoriler getirilirken bir hata oluştu' });
  }
});

// Tek bir kategoriyi getir
router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        icon: true,
        products: true
      }
    });
    if (!category) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Kategori getirilirken bir hata oluştu' });
  }
});

export default router; 