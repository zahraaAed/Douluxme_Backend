import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import sequelize from './Config/db.js';
import cors from 'cors';

import userRoute from './Routes/userRoute.js';
import nutRoute from './Routes/nutRoute.js';
import categoryRoute from './Routes/categoryRoute.js';
import chocolateRoute from './Routes/chocolateRoute.js';
import productRoute from './Routes/productRoute.js';
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware
app.use(cookieParser());
app.use(express.json());



// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working with TypeScript!');
});
app.use('/api/users', userRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/nuts', nutRoute);
app.use('/api/chocolates', chocolateRoute);
app.use('/api/products', productRoute);

// Sequelize Sync and Server Start
sequelize.sync({ alter: true }) // alter updates schema to match models
  .then(() => {
    console.log('Database connected and synchronized.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Database sync error:', error);
  });
