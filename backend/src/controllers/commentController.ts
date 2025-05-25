import { Request, Response } from 'express';
import { prisma } from '../db';

// GET /comments?productId=xx
export const getComments = async (req: Request, res: Response) => {
  const { productId, userId } = req.query;
  if (!productId) {
    return res.status(400).json({ error: 'productId gerekli' });
  }
  try {
    // Tüm yorumları çek
    const comments = await prisma.comment.findMany({
      where: { productId: Number(productId) },
      orderBy: { timestamp: 'desc' }
    });
    // adminReply sadece ilgili kullanıcıya gösterilsin
    const filtered = comments.map((c: any) => {
      if (c.adminReply) {
        // userId query paramı yoksa veya userId eşleşmiyorsa adminReply'ı gizle
        if (!userId || c.userId !== Number(userId)) {
          return { ...c, adminReply: null };
        }
      }
      return c;
    });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Yorumlar alınamadı' });
  }
};

// POST /comments
export const addComment = async (req: Request, res: Response) => {
  const { userId, productId, comment } = req.body;
  if (!userId || !productId || !comment) {
    return res.status(400).json({ error: 'Eksik veri' });
  }
  try {
    const data: any = {
      userId: Number(userId),
      productId: Number(productId),
      comment
    };
    const newComment = await prisma.comment.create({
      data,
      include: { user: true }
    });
    res.json({
      id: newComment.id,
      userId: newComment.userId,
      productId: newComment.productId,
      comment: newComment.comment,
      timestamp: newComment.timestamp,
      adminReply: newComment.adminReply || null
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

// Adminin sadece adminReply eklemesi için yeni fonksiyon
// PATCH /comments/:id/admin-reply
export const addAdminReply = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { adminReply } = req.body;
  if (!adminReply) {
    return res.status(400).json({ error: 'adminReply gerekli' });
  }
  try {
    const updated = await prisma.comment.update({
      where: { id: Number(id) },
      data: { adminReply }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Admin cevabı eklenemedi' });
  }
}; 