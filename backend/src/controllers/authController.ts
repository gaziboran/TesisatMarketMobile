import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        console.log('Kayıt isteği alındı:', req.body);
        
        const { username, password, phone, email, fullName, address } = req.body;

        // Gerekli alanların kontrolü
        if (!username || !password || !phone || !email || !fullName || !address) {
            return res.status(400).json({ 
                message: 'Tüm alanları doldurmanız gerekiyor',
                missingFields: {
                    username: !username,
                    password: !password,
                    phone: !phone,
                    email: !email,
                    fullName: !fullName,
                    address: !address
                }
            });
        }

        // Kullanıcı adı veya email kontrolü
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Bu email zaten kullanılıyor' });
            }
        }

        // Yeni kullanıcı oluştur (şifre hash'lemeden)
        const user = await prisma.user.create({
            data: {
                username,
                password, // Direkt şifreyi kaydet
                phone,
                email,
                fullName,
                address,
                roleId: 1
            }
        });

        console.log('Kullanıcı oluşturuldu:', user);

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'supersecretkey123',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kayıt başarılı',
            token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                email: user.email,
                fullName: user.fullName,
                address: user.address,
                roleId: user.roleId
            }
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Kullanıcıyı username veya email ile bul
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: username }
                ]
            },
            include: {
                carts: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı/email veya şifre' });
        }

        // Şifreyi direkt karşılaştır
        if (password !== user.password) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı/email veya şifre' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'supersecretkey123',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                email: user.email,
                fullName: user.fullName,
                address: user.address,
                roleId: user.roleId,
                carts: user.carts.map(cart => ({
                    id: cart.id,
                    userId: cart.userId,
                    productId: cart.productId,
                    quantity: cart.quantity
                }))
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Yetkilendirme hatası' });
        }

        const { phone, email, fullName, address } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                phone,
                email,
                fullName,
                address
            }
        });

        res.json({
            message: 'Profil başarıyla güncellendi',
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                phone: updatedUser.phone,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                address: updatedUser.address
            }
        });
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Yetkilendirme hatası' });
        }

        const { currentPassword, newPassword } = req.body;

        // Kullanıcıyı bul
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Mevcut şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mevcut şifre yanlış' });
        }

        // Yeni şifreyi hashle
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Şifreyi güncelle
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Şifre başarıyla değiştirildi' });
    } catch (error) {
        console.error('Şifre değiştirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                fullName: true,
                address: true,
                roleId: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Kullanıcılar alınırken hata:', error);
        res.status(500).json({ message: 'Kullanıcılar alınırken bir hata oluştu' });
    }
}; 