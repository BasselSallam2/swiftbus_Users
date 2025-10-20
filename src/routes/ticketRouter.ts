import express from "express";

const router = express.Router();
import {showTicket , DownloadTicket , showTicketEN} from "../controllers/ticketController.js"

router.get("/en/ticket" , showTicketEN) ;
router.get("/ticket" , showTicket) ;
router.get("/ticketDownload/:id" , DownloadTicket) ;

export default router;
