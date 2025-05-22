import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PlumberRequest {
  id: string;
  userId: number;
  address: string;
  phoneNumber: string;
  problemDescription: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  image?: string;
}

export const createPlumberRequest = async (data: Omit<PlumberRequest, 'id' | 'createdAt' | 'updatedAt'> & { image?: string }) => {
  return prisma.plumberRequest.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

export const getPlumberRequestsByUserId = async (userId: number) => {
  return prisma.plumberRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updatePlumberRequestStatus = async (id: string, status: PlumberRequest['status']) => {
  return prisma.plumberRequest.update({
    where: { id },
    data: {
      status,
      updatedAt: new Date(),
    },
  });
}; 