import { Request, Response, NextFunction } from "express";
// import { logger } from "../utils/logger.js";
import { failureResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";

export const errorHandler = (
	err: Error | CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// logger.error(`Error: ${err.message}`);

	if (err instanceof CustomError) {
		return failureResponse(res, err.statusCode, {
			message: err.message,
			code: err.code,
		});
	}

	failureResponse(res, 500, {
		message: err.message,
		code: "INTERNAL_SERVER_ERROR",
	});
};
