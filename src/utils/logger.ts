// import winston from "winston";
// import "winston-daily-rotate-file";
// import path from "path";

// const logDirectory = path.join(process.cwd(), "logs"); // Uses project root

// const logFormat = winston.format.combine(
// 	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
// 	winston.format.printf(
// 		({ timestamp, level, message }) =>
// 			`${timestamp} [${level.toUpperCase()}]: ${message}`
// 	)
// );

// const dailyRotateTransport = (level: string) =>
// 	new winston.transports.DailyRotateFile({
// 		filename: path.join(logDirectory, `%DATE%-${level}.log`),
// 		datePattern: "YYYY-MM-DD",
// 		maxSize: "1g",
// 		maxFiles: "14d",
// 		level,
// 		zippedArchive: true,
// 	});

// export const logger = winston.createLogger({
// 	level: "info",
// 	format: logFormat,
// 	transports: [
// 		new winston.transports.Console(),
// 		dailyRotateTransport("error"),
// 		dailyRotateTransport("warn"),
// 		dailyRotateTransport("info"),
// 	],
// });

// export default logger;
