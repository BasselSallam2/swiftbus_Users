import express from "express";

const router = express.Router();
 import {ArabicPolicy , Arabicterms , EnglishPolicy , Englishterms} from "../controllers/TermsController.js"

router.get("/policy/en" , EnglishPolicy)  ;
router.get("/policy" , ArabicPolicy)  ;
router.get("/terms" , Arabicterms)  ;
router.get("/terms/en" , Englishterms)  ;

export default router;
