import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import destinationRoutes from './routes/destination.routes';
import packageRoutes from './routes/package.routes';
import bookingRoutes from './routes/booking.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';
import reviewRoutes from './routes/review.routes';
import notificationRoutes from './routes/notification.routes';
import webhookRoutes from './routes/webhook.routes';
import uploadRoutes from './routes/upload.routes';
import contactRoutes from './routes/contact.routes';
import { notFound, errorHandler } from './middlewares/error.middleware';

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin}`));
  },
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
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

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

// Local dev server (not used on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
  });
}

export default app;

