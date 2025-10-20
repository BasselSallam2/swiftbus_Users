export class CustomError extends Error {
	code: string;
	statusCode: number;

	constructor(
		message: string,
		statusCode: number = 500,
		code: string = "INTERNAL_SERVER_ERROR"
	) {
		super(message);
		this.name = "CustomError";
		this.statusCode = statusCode;
		this.code = code;
	}
}
