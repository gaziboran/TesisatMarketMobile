import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import plumberRequestRoutes from './routes/plumberRequestRoutes';
 
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/plumber-requests', plumberRequestRoutes); 