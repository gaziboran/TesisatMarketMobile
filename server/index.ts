import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/comments', async (req: Request, res: Response) => {
  const { productId } = req.query;
  if (!productId) {
    return res.status(400).json({ error: 'productId gerekli' });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { productId: Number(productId) },
      orderBy: { timestamp: 'desc' }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Yorumlar alınamadı' });
  }
});

app.post('/api/comments', async (req: Request, res: Response) => {
  try {
    const { userId, productId, comment, timestamp, userName } = req.body;

    if (!userId || !productId || !comment || !timestamp || !userName) {
      return res.status(400).json({ error: 'Eksik bilgi' });
    }

    const newComment = await prisma.comment.create({
      data: {
        userId,
        productId,
        comment,
        timestamp: new Date(timestamp),
        userName
      }
    });

    return res.json(newComment);
  } catch (error) {
    console.error('Yorum eklenirken hata:', error);
    return res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 