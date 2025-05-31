import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  // add other fields if present
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'yoursecret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = { id: decoded.id }; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};