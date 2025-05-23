import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Request tipini genişlet
interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { address, products, totalPrice } = req.body;
        const userId = req.user?.userId;
        
        if (!userId) {
            console.error('Kullanıcı kimliği bulunamadı');
            return res.status(401).json({ error: 'Oturum açmanız gerekiyor' });
        }
        
        console.log('Yeni sipariş oluşturuluyor:', {
            userId,
            address,
            products,
            totalPrice
        });

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
                        price: totalPrice / products.length
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

        console.log('Sipariş başarıyla oluşturuldu:', {
            orderId: order.id,
            userId: order.userId,
            total: order.total,
            status: order.status
        });

        // Sipariş oluşturulduktan sonra sepeti temizle
        await prisma.cart.deleteMany({
            where: { userId }
        });

        console.log('Kullanıcı sepeti temizlendi:', { userId });

        res.status(201).json(order);
    } catch (error) {
        console.error('Sipariş oluşturma hatası:', error);
        res.status(500).json({ error: 'Sipariş oluşturulurken bir hata oluştu' });
    }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            console.error('Kullanıcı kimliği bulunamadı');
            return res.status(401).json({ error: 'Oturum açmanız gerekiyor' });
        }

        console.log('Kullanıcı siparişleri getiriliyor:', { userId });

        const orders = await prisma.order.findMany({
            where: {
                userId: userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('Kullanıcı siparişleri başarıyla getirildi:', {
            userId,
            orderCount: orders.length
        });

        res.json(orders);
    } catch (error) {
        console.error('Sipariş getirme hatası:', error);
        res.status(500).json({ error: 'Siparişler getirilirken bir hata oluştu' });
    }
}; 

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }
    // Admin kontrolü (kendi middleware'iniz varsa oraya taşıyabilirsiniz)
    // Burada örnek olarak userId üzerinden kontrol ediliyor
    // Gerçek projede JWT içinden roleId alınmalı
    // Şimdilik userId=1 admin kabul edelim veya roleId==0 kontrolü yapılmalı
    // Eğer req.user varsa:
    // if (!req.user || req.user.roleId !== 0) return res.status(403).json({ message: 'Yetkisiz' });
    // Şimdilik roleId kontrolü yoksa, sadece endpointi ekliyorum
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    console.error('Sipariş durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Admin kontrolü (JWT varsa req.user.roleId bakılmalı)
    // Şimdilik herkes erişebiliyor, istersen roleId==0 kontrolü ekle
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Tüm siparişleri getirme hatası:', error);
    res.status(500).json({ message: 'Siparişler getirilirken bir hata oluştu' });
  }
}; 