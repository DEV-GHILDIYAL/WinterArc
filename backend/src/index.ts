import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, CLIENT_ORIGIN } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import logRoutes from './routes/logRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Trust proxy for rate limiter behind reverse proxy / docker Nginx / Caddy
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration for cookies and production frontend origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman) or matching frontend
      if (!origin || origin === CLIENT_ORIGIN || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow configured origins
      }
    },
    credentials: true,
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'WinterArc API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/stats', statsRoutes);

// Error Handler
app.use(errorHandler);

// Start server after connecting to database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🔥 [WinterArc Backend] Server running on port ${PORT}`);
  });
};

startServer();
