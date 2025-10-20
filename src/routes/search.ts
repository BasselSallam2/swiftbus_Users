import express from "express";
import cleanup from "../middlewares/clear.js"

const router = express.Router();
import { Searchresult , SearchresultEN } from "../controllers/searchController.js";
import {SelectSingleTrip , SelectdoubleTrip , SelectSingleTripEN , SelectdoubleTripEN} from "../controllers/SingleTripController.js"



router.post("/en/submit-booking" , SearchresultEN ) ;
router.post("/submit-booking" , Searchresult) ;
router.post("/selectsingletrip" , SelectSingleTrip);
router.post("/en/selectsingletrip" , SelectSingleTripEN);
router.post("/selectdoubletrip" , SelectdoubleTrip);
router.post("/en/selectdoubletrip" , SelectdoubleTripEN);

export default router;
