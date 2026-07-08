// --- Environment Setup ---
import dotenv from 'dotenv';
dotenv.config();

// --- Core Modules ---
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// --- API Documentation ---
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import { apiReference } from '@scalar/express-api-reference';

// --- Routes ---
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import seoRecommendationsRoutes from './routes/seoRecommendation.routes.js';
import historyRoutes from './routes/history.routes.js';
import lighthouseRoutes from './routes/lightHouse.routes.js';
import seoRoutes from './routes/seoRoutes.js';
import techStackRoutes from './routes/techstackroute.js';
import techstackChatRoutes from './routes/techstackChatRoute.js';
import userChatRoutes from './routes/userChatRoutes.js';
import dashboardRoutes from './routes/dashboard.js';
import chatRoutes from './routes/chatRoutes.js';
import websiteRoutes from './routes/websiteRoutes.js';

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 4500;

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4500',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
  if (!origin) return callback(null, true); // Allow requests with no origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(null, true); // Change to callback(new Error('Not allowed by CORS')) for strict mode
    }
  },
  credentials: true,
}));

// --- Core Middleware ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Webhook Raw Body Middleware ---
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Health Check Route ---
app.get('/', (req, res) => {
  res.send('Welcome to SiteIQ Backend!');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seoreports', seoRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/lighthouse', lighthouseRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/techstackchat', techstackChatRoutes);
app.use('/api/seoRecommendations', seoRecommendationsRoutes);
app.use('/api/userchat', userChatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/websiteChat', chatRoutes);

// --- API Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/reference', apiReference({
  url: '/openapi.json',
  theme: 'purple',
}));

app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});