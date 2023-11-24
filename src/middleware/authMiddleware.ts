// authentication.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../models/User';

dotenv.config();

declare module 'express-serve-static-core' {
  interface Request {
    resetTokenPayload: any; // Adjust the type according to your payload structure
  }
}

const Secret = process.env.JWT_SECRET || 'default-secret';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers['authorization'];
  let token: any = null;
  if (bearerToken) {
    token = bearerToken.split(' ')[1];
  }

  if (!token) {
    return res.status(403).json({ error: 'Token required' });
  }

  try {
    // Verify token and decode
    const decoded: any = jwt.verify(token, Secret);
    

    const user = await UserModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    req.body.user = user;
    // console.log(decoded);
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};
