import { Request, Response, NextFunction } from "express";
import { failureResponse } from "../utils/apiResponse.js";
import { z } from "zod";

const validationMiddelware = (schema: z.ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return failureResponse(res, 400, {
				message: result.error.errors[0].message,
				code: "VALIDATION_ERROR",
			});
		}
		next();
	};
};

export default validationMiddelware;
