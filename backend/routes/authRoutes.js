import express from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/AuthController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateJWT, getCurrentUser);
router.post('/logout', authenticateJWT, logout);

export default router;