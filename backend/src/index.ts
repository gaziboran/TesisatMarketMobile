import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.json({ message: 'Tesisat Market API çalışıyor' });
});

// Hata yakalama middleware'i
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Bir hata oluştu',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Sunucu hatası'
    });
});

// Veritabanı bağlantısını kontrol et ve sunucuyu başlat
async function startServer() {
    try {
        // Veritabanı bağlantısını test et
        await prisma.$connect();
        console.log('Veritabanı bağlantısı başarılı');

        // Sunucuyu başlat
        app.listen(PORT, () => {
            console.log(`Server ${PORT} portunda çalışıyor`);
        });
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error);
        process.exit(1);
    }
}

startServer();

// Uygulama kapatıldığında veritabanı bağlantısını kapat
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
}); 