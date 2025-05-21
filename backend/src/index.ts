import express from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import commentRoutes from './routes/commentRoutes';
import { errorHandler } from './middleware/errorHandler';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar için public klasörünü kullan
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/comments', commentRoutes);

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.json({ message: 'Tesisat Market API çalışıyor' });
});

// Hata yakalama middleware'i
app.use(errorHandler);

// Veritabanı bağlantısını test et ve sunucuyu başlat
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