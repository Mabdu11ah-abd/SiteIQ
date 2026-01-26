import express from "express";
import {
  generateAndScoreReport,
  deleteReport,
  returnReport,
  getSeoReports,
  deletePhraseResultByPhrase,
  getAuthoritasAccountInfo
} from '../controllers/seoController.js';

const router = express.Router(); 

router.get("/account", getAuthoritasAccountInfo);  // no body or params, just

router.post("/generate", generateAndScoreReport);   // body {domain, phrase}awe

router.delete("/delete/:jid", deleteReport); // params {jid} 

router.get("/return/:jid", returnReport);  // params {jid}

router.get("/websites/:websiteId", getSeoReports);

router.delete("/delete/:websiteId/:phrase",deletePhraseResultByPhrase); // params {websiteId, phrase}

export default router;