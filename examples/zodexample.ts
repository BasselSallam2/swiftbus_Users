//define zod schema

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { failureResponse } from "../src/utils/apiResponse.js";

export const UserSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	address: z.string().optional(),
});

// create the middle ware
export const validateSchema = (schema: z.ZodSchema) => {
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
