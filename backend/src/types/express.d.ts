import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
            };
        }
    }
}

export interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
} 