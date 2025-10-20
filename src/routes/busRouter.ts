import express from "express";
import {
	GetBus,
	DeleteBus,
	CreateBus,
	EditBus,
} from "../controllers/busController.js";
const router = express.Router();
import Validation from "../middlewares/Validation.js";
import { BusSchema } from "../validations/ValidationSchema.js";
const validationMiddelware = Validation(BusSchema);

router.get("/bus", GetBus);
router.delete("/bus/:id", DeleteBus);
router.post("/bus", validationMiddelware, CreateBus);
router.put("/bus/:id", validationMiddelware, EditBus);

export default router;
