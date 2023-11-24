import express from 'express';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import reviewRoutes from './routes/reviewRoutes';
import paymentRoutes from './routes/paymentRoutes';
import shippingRoutes from './routes/ShippingRoutes';

const app = express();

app.use(express.json());

// product routes
app.use('/api/products', productRoutes);

// users routes
app.use('/api/user', userRoutes);

// category routes
app.use('/api/category', categoryRoutes);

// order routes
app.use('/api/order', orderRoutes);

// cart routes
app.use('/api/cart', cartRoutes);

// review routes
app.use('/api/review', reviewRoutes);

// review routes
app.use('/api/payment', paymentRoutes);

// shipping routes
app.use('/api/shipping', shippingRoutes);

export default app;