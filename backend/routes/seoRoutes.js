import express from "express";
import {
  generateAndScoreReport,
  deleteReport,
  returnReport,
  getSeoReports,
  deletePhraseResultByPhrase,
  getAuthoritasAccountInfo
} from '../controllers/seoController.js';
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All SEO routes require authentication
router.get("/account", authenticateJWT, getAuthoritasAccountInfo);
router.post("/generate", authenticateJWT, generateAndScoreReport);
router.delete("/delete/:jid", authenticateJWT, deleteReport);
router.get("/return/:jid", authenticateJWT, returnReport);
router.get("/websites/:websiteId", authenticateJWT, getSeoReports);
router.delete("/delete/:websiteId/:phrase", authenticateJWT, deletePhraseResultByPhrase);

export default router;