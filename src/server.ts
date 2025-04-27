import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import sequelize from './Config/db.js';
import { setupAssociations } from './Models/associations.js';
import path from 'path';
import cors from 'cors';

import userRoute from './Routes/userRoute.js';
import nutRoute from './Routes/nutRoute.js';
import categoryRoute from './Routes/categoryRoute.js';
import chocolateRoute from './Routes/chocolateRoute.js';
import productRoute from './Routes/productRoute.js';
import feedbackRoute from './Routes/feedbackRoute.js';
import orderRoute from './Routes/orderRoute.js';
import cartRoute from './Routes/cartRoute.js';
import orderDetailRoute from './Routes/orderDetailRoute.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working with TypeScript!');
});
app.use('/api/users', userRoute);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/nuts', nutRoute);
app.use('/api/chocolates', chocolateRoute);
app.use('/api/feedbacks', feedbackRoute);
app.use('/api/orders', orderRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orderDetails', orderDetailRoute);
// Sequelize Sync and Server Start




setupAssociations(); 
sequelize.sync({ alter: false }) // alter updates schema to match models
  .then(() => {
    console.log('Database connected and synchronized.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Database sync error:', error);
  });
