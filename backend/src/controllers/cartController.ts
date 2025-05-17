import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity, userId } = req.body;

        // Ürünün var olup olmadığını kontrol et
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        // Kullanıcının var olup olmadığını kontrol et
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Sepette aynı üründen var mı kontrol et
        const existingCartItem = await prisma.cart.findFirst({
            where: {
                AND: [
                    { userId: userId },
                    { productId: productId }
                ]
            }
        });

        if (existingCartItem) {
            // Varsa miktarı güncelle
            const updatedCart = await prisma.cart.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: {
                        increment: quantity
                    }
                }
            });
            return res.json(updatedCart);
        }

        // Yoksa yeni ekle
        const newCartItem = await prisma.cart.create({
            data: {
                userId,
                productId,
                quantity
            }
        });

        res.status(201).json(newCartItem);
    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        res.status(500).json({ message: 'Sepete eklenirken bir hata oluştu' });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.cart.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Ürün sepetten kaldırıldı' });
    } catch (error) {
        console.error('Sepetten silme hatası:', error);
        res.status(500).json({ message: 'Sepetten silinirken bir hata oluştu' });
    }
};

export const getCart = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const cartItems = await prisma.cart.findMany({
            where: { userId: Number(userId) },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        image: true,
                        description: true
                    }
                }
            }
        });
        res.json(cartItems);
    } catch (error) {
        console.error('Sepet getirme hatası:', error);
        res.status(500).json({ message: 'Sepet bilgileri alınırken bir hata oluştu' });
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const cartItem = await prisma.cart.findUnique({
            where: { id: Number(id) }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Sepet öğesi bulunamadı' });
        }

        const updatedCartItem = await prisma.cart.update({
            where: { id: Number(id) },
            data: { quantity },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        image: true,
                        description: true
                    }
                }
            }
        });

        res.json(updatedCartItem);
    } catch (error) {
        console.error('Sepet güncelleme hatası:', error);
        res.status(500).json({ message: 'Sepet güncellenirken bir hata oluştu' });
    }
}; 