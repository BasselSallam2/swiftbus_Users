import express from "express";

const router = express.Router();
import {paymobPay , paymentCallback , doublepaymobPay} from "../controllers/paymentController.js"

router.post("/payment" , paymobPay) ;
router.post("/doublepayment" , doublepaymobPay) ;
router.post("/paymentcallback" , paymentCallback) ;

export default router;
