import { Request, Response } from 'express';
import { prisma } from '../db';

// GET /comments?productId=xx
export const getComments = async (req: Request, res: Response) => {
  const { productId } = req.query;
  if (!productId) {
    return res.status(400).json({ error: 'productId gerekli' });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { productId: Number(productId) },
      include: { user: true },
      orderBy: { timestamp: 'desc' }
    });
    // userName ekle
    const result = comments.map((c: any) => ({
      id: c.id,
      userId: c.userId,
      productId: c.productId,
      comment: c.comment,
      timestamp: c.timestamp,
      userName: c.user?.username || ''
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Yorumlar alınamadı' });
  }
};

// POST /comments
export const addComment = async (req: Request, res: Response) => {
  const { userId, productId, comment, timestamp } = req.body;
  if (!userId || !productId || !comment) {
    return res.status(400).json({ error: 'Eksik veri' });
  }
  try {
    const newComment = await prisma.comment.create({
      data: {
        userId: Number(userId),
        productId: Number(productId),
        comment,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      },
      include: { user: true }
    });
    res.json({
      id: newComment.id,
      userId: newComment.userId,
      productId: newComment.productId,
      comment: newComment.comment,
      timestamp: newComment.timestamp,
      userName: newComment.user?.username || ''
    });
  } catch (err) {
    res.status(500).json({ error: 'Yorum eklenemedi' });
  }
}; 