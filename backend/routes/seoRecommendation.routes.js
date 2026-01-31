// routes/seoRecommendation.routes.js

import express from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js';
import checkSubscriptionLimit from '../middleware/checkSubscriptionLimit.js';
import incrementUsage from '../utils/incrementUsage.js';
import {
  generateSEORecommendations,
  getSEORecommendations,
  generateLightHouseRecommendation,
  getUserSeoRecommendations,
  updateRecommendation,
  deleteRecommendation,
} from '../controllers/seoRecommendation.controller.js';

const router = express.Router();

// All routes require authentication
router.post(
    '/generate/:websiteId',
    authenticateJWT,
    checkSubscriptionLimit('seo'),  
    async (req, res, next) => {
      await incrementUsage(req.userId, 'seo');
      next();
    },
    generateSEORecommendations
  );

router.post('/generate-lighthouse', authenticateJWT, generateLightHouseRecommendation);
router.get('/:websiteId', authenticateJWT, getSEORecommendations);
router.put('/:id', authenticateJWT, updateRecommendation);
router.delete('/:id', authenticateJWT, deleteRecommendation);

export default router;
