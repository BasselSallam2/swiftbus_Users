import express from "express";
const router = express.Router();
import {Getlanding , GetlandingEn} from "../controllers/landingController.js"

router.get("/" , Getlanding) ;
router.get("/en" , GetlandingEn) ;

export default router;
