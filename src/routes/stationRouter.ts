import express from "express";

import {
	CreateStation,
	EditStation,
	DeleteStation,
	GetStation,
} from "../controllers/stationController.js";
const router = express.Router();
import validationMiddelware from "../middlewares/Validation.js";
import { StationSchema } from "../validations/ValidationSchema.js";
const validateStation = validationMiddelware(StationSchema);

router.get("/station", GetStation);
router.delete("/station/:id", DeleteStation);
router.post("/station", validateStation, CreateStation);
router.put("/station/:id", validateStation, EditStation);

export default router;
