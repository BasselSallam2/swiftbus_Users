import express from "express";

import {
	CreateCity,
	GetCity,
	DeleteCity,
	EditCity,
} from "../controllers/cityController.js";
const router = express.Router();

import Validation from "../middlewares/Validation.js";
import { CitySchema } from "../validations/ValidationSchema.js";
const validationMiddelware = Validation(CitySchema);

router.get("/city", GetCity);
router.delete("/city/:id", DeleteCity);
router.post("/city", validationMiddelware, CreateCity);
router.put("/city/:id", validationMiddelware, EditCity);

export default router;
