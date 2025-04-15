// types/express/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      userId: number;
      role: 'admin' | 'customer';
    }

    interface Request {
      user?: User;
    }
  }
}
