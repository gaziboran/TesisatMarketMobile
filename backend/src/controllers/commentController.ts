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

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: true,
        product: true
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Tüm yorumlar alınamadı' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Yorum silinemedi' });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ error: 'Yorum metni gerekli' });
    const updated = await prisma.comment.update({
      where: { id: Number(id) },
      data: { comment }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Yorum güncellenemedi' });
  }
}; 