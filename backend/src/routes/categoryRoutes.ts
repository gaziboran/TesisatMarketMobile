import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../public/images/categories');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploadCategory = multer({ storage: categoryStorage });

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

router.post('/upload-image', uploadCategory.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi' });
  }
  // Dönüş yolu: /images/categories/...
  const imagePath = `/images/categories/${req.file.filename}`;
  res.json({ imagePath });
});

export default router; 