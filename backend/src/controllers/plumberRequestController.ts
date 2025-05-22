import { Request, Response } from 'express';
import { createPlumberRequest, getPlumberRequestsByUserId, updatePlumberRequestStatus, updatePlumberRequestRatingAndComment } from '../models/PlumberRequest';
import path from 'path';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { userId, address, phoneNumber, problemDescription } = req.body;
    let image = undefined;
    if (req.file) {
      image = path.join('uploads/plumber-requests', req.file.filename);
    }

    if (!userId || !address || !phoneNumber || !problemDescription) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const request = await createPlumberRequest({
      userId: Number(userId),
      address,
      phoneNumber,
      problemDescription,
      status: 'pending',
      image,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Tesisatçı talebi oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const getUserRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requests = await getPlumberRequestsByUserId(Number(userId));
    res.json(requests);
  } catch (error) {
    console.error('Tesisatçı talepleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }

    const request = await updatePlumberRequestStatus(id, status);
    res.json(request);
  } catch (error) {
    console.error('Tesisatçı talebi güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const updateRequestRatingAndComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (rating === undefined && comment === undefined) {
      return res.status(400).json({ message: 'Puan veya yorum zorunlu' });
    }
    const request = await updatePlumberRequestRatingAndComment(id, rating, comment);
    res.json(request);
  } catch (error) {
    console.error('Tesisatçı talebi puan/yorum güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 