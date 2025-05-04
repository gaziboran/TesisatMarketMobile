import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password, phone } = req.body;

        // Kullanıcı adı kontrolü
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor' });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni kullanıcı oluştur
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                phone
            }
        });

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'gizli-anahtar',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone
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

        // Kullanıcıyı bul
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'gizli-anahtar',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Giriş başarılı',
            token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
}; 