import { Response } from "express";

export const successResponse = <T = unknown>(
	res: Response,
	statusCode: number,
	input: {
		message: string;
		data: T | null;
	}
) => {
	res.status(statusCode).json({
		...input,
	});
};
export const failureResponse = (
	res: Response,
	statusCode: number,
	input: {
		message: string;
		code: string;
	}
) => {
	res.status(statusCode).json({
		...input,
	});
};
