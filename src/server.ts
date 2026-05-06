import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.ts';
import authRoutes from './routes/auth.routes.ts';
import destinationRoutes from './routes/destination.routes.ts';
import packageRoutes from './routes/package.routes.ts';
import bookingRoutes from './routes/booking.routes.ts';
import aiRoutes from './routes/ai.routes.ts';
import adminRoutes from './routes/admin.routes.ts';
import reviewRoutes from './routes/review.routes.ts';
import notificationRoutes from './routes/notification.routes.ts';
import webhookRoutes from './routes/webhook.routes.ts';
import { notFound, errorHandler } from './middlewares/error.middleware.ts';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));

// Stripe webhook — must be BEFORE express.json() (needs raw body)
app.use('/api/webhook', webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Travel Booking API is running...',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${corsOptions.origin.join(', ')}`);
});

