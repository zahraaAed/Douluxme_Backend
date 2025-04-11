import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/userRoute';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cookieParser());
app.use(express.json());

// Example route
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working with TypeScript!');
});
app.use('/api/users', userRoutes);

// Server listener
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
