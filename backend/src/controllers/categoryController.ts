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