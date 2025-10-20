import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
	console.error(`Unhandled Rejection: ${err.message}`);
	server.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
	console.error(`Unhandled Rejection: ${err.message}`);
	server.close(() => process.exit(1));
});
