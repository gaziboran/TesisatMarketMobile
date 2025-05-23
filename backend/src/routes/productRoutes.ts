import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../public/images/products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploadProduct = multer({ storage: productStorage });

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

// Ürün ekle
router.post('/', async (req, res) => {
    try {
        const { name, description, price, stock, image, categoryId } = req.body;
        if (!name || !price || !categoryId) {
            return res.status(400).json({ message: 'Zorunlu alanlar eksik' });
        }
        const product = await prisma.product.create({
            data: { name, description, price: Number(price), stock: Number(stock) || 0, image, categoryId: Number(categoryId) }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu.' });
    }
});

// Ürün sil
router.delete('/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Ürün silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Ürün silinirken bir hata oluştu.' });
    }
});

router.post('/upload-image', uploadProduct.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi' });
  }
  // Dönüş yolu: /images/products/...
  const imagePath = `/images/products/${req.file.filename}`;
  res.json({ imagePath });
});

export default router; 