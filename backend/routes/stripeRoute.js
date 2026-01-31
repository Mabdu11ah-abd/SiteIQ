// routes/stripeRoutes.js

import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = express.Router();

// Create a Stripe Checkout session (requires authentication)
router.post('/create-checkout-session', authenticateJWT, createCheckoutSession);

// Handle Stripe Webhook events (no authentication needed - verified by Stripe signature)
router.post('/webhook', handleWebhook);

export default router;
