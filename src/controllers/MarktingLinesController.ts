// import { Request, Response, NextFunction } from "express";
// import {successResponse } from "../utils/apiResponse";
// import { CustomError } from "../utils/CustomError";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// export const GetMartkingLine = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const Marktingline = await prisma.marktingLines.findMany();

// 		if (!Marktingline || Marktingline.length === 0) {
// 			throw new CustomError(
// 				"No Marktinglines found",
// 				404,
// 				"MARKTINGLINE_NOT_FOUND"
// 			);
// 		}

// 		const data = {
// 			message: "Markting lines data retrieved successfully",
// 			data: Marktingline,
// 		};

// 		successResponse(res, 200, data);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// export const DeleteMartkingLine = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const { id } = req.params;

// 		const MartkingLine = await prisma.marktingLines.findUnique({
// 			where: {
// 				id: id,
// 			},
// 		});

// 		if (!MartkingLine) {
// 			throw new CustomError(
// 				"Martking Line not found",
// 				404,
// 				"MARKTINGLINE_NOT_FOUND"
// 			);
// 		}

// 		await prisma.marktingLines.delete({
// 			where: {
// 				id: id,
// 			},
// 		});

// 		const data = {
// 			message: "Markting Line deleted successfully",
// 			data: MartkingLine,
// 		};
// 		successResponse(res, 200, data);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// export const CreateMartkingLine = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const { from, to } = req.body;
// 	try {
// 		const MartkingLine = await prisma.marktingLines.create({
// 			data: {
// 				from: from,
// 				to: to,
// 			},
// 		});
// 		const data = {
// 			message: "Markting Line created successfully",
// 			data: MartkingLine,
// 		};
// 		successResponse(res, 201, data);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// export const EditMarktingLine = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const { id } = req.params;
// 		const { from, to } = req.body;

// 		const MartkingLine = await prisma.marktingLines.findUnique({
// 			where: {
// 				id: id,
// 			},
// 		});

// 		if (!MartkingLine) {
// 			throw new CustomError(
// 				"MartkingLine not found",
// 				404,
// 				"MARKTINGLINE_NOT_FOUND"
// 			);
// 		}

// 		const updatedMartkingLine = await prisma.marktingLines.update({
// 			where: {
// 				id: id,
// 			},
// 			data: {
// 				Arabiccity
// 			},
// 		});

// 		const data = {
// 			message: "MartkingLine updated successfully",
// 			data: updatedMartkingLine,
// 		};
// 		successResponse(res, 200, data);
// 	} catch (error) {
// 		next(error);
// 	}
// };
