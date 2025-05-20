import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, address, products, totalPrice } = req.body;

        // Order oluştur
        const order = await prisma.order.create({
            data: {
                userId,
                address,
                status: 'pending',
                total: totalPrice,
                items: {
                    create: products.map((product: any) => ({
                        productId: product.productId,
                        quantity: product.quantity,
                        price: totalPrice / products.length // Her ürün için eşit fiyat dağıtımı
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Sipariş oluşturulduktan sonra sepeti temizle
        await prisma.cart.deleteMany({
            where: { userId }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Sipariş oluşturma hatası:', error);
        res.status(500).json({ error: 'Sipariş oluşturulurken bir hata oluştu' });
    }
}; 