import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  role: 'customer' | 'admin';
}

// 👇 Fix req.user typing
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as DecodedToken;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (roles: ('customer' | 'admin')[]): ((req: Request, res: Response, next: NextFunction) => Response | void) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export { authenticate, authorize };
