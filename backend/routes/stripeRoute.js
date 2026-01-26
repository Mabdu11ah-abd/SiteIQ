// routes/stripeRoutes.js

import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController.js';

const router = express.Router();

// Create a Stripe Checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Handle Stripe Webhook events (ensure the raw body is passed to handle webhook signature verification)
router.post('/webhook', handleWebhook);

export default router;
