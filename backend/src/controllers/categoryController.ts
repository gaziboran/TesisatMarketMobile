import { Request, Response } from 'express';
import { prisma } from '../db';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: true
            }
        });
        res.json(categories);
    } catch (error) {
        console.error('Kategorileri getirme hatası:', error);
        res.status(500).json({ message: 'Kategoriler getirilirken bir hata oluştu' });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: {
                products: true
            }
        });
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        res.json(category);
    } catch (error) {
        console.error('Kategori getirme hatası:', error);
        res.status(500).json({ message: 'Kategori getirilirken bir hata oluştu' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, image, icon } = req.body;
        const category = await prisma.category.create({
            data: { name, description, image, icon }
        });
        res.status(201).json(category);
    } catch (error) {
        console.error('Kategori ekleme hatası:', error);
        res.status(500).json({ message: 'Kategori eklenirken bir hata oluştu' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, image, icon } = req.body;
        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: { name, description, image, icon }
        });
        res.json(category);
    } catch (error) {
        console.error('Kategori güncelleme hatası:', error);
        res.status(500).json({ message: 'Kategori güncellenirken bir hata oluştu' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id: Number(id) } });
        res.json({ message: 'Kategori silindi' });
    } catch (error) {
        console.error('Kategori silme hatası:', error);
        res.status(500).json({ message: 'Kategori silinirken bir hata oluştu' });
    }
}; 