import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";

import prisma from "../lib/prisma.js"

export const GetBus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const buses = await prisma.bus.findMany({
			where: {
				isDeleted: false,
			},
			select: {
				id: true,
				type: true,
				layout: true,
				seats: true,
				specialseats: true,
			},
		});

		if (!buses || buses.length === 0) {
			throw new CustomError("No buses found", 404, "BUS_NOT_FOUND");
		}

		const data = {
			message: "Bus data retrieved successfully",
			data: buses,
		};

		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};

export const DeleteBus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const bus = await prisma.bus.findUnique({
			where: {
				id: id,
			},
		});

		if (!bus) {
			throw new CustomError("Bus not found", 404, "BUS_NOT_FOUND");
		}

		await prisma.bus.update({
			where: {
				id: id,
			},
			data: {
				isDeleted: true,
				type: bus.type + " - Deleted" + new Date().toISOString(),
			},
		});

		const data = {
			message: "Bus deleted successfully",
			data: bus,
		};
		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};

export const CreateBus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { type, layout, seats, specialseats } = req.body;
	try {
		const bus = await prisma.bus.create({
			data: {
				type: type,
				layout: layout,
				seats: seats,
				specialseats: specialseats,
			},
		});
		const data = { message: "Bus created successfully", data: bus };
		successResponse(res, 201, data);
	} catch (error) {
		next(error);
	}
};

export const EditBus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { type, layout, seats, specialseats } = req.body;

		const bus = await prisma.bus.findUnique({
			where: {
				id: id,
			},
		});

		if (!bus) {
			throw new CustomError("Bus not found", 404, "BUS_NOT_FOUND");
		}

		const updatedBus = await prisma.bus.update({
			where: {
				id: id,
			},
			data: {
				type: type,
				layout: layout,
				seats: seats,
				specialseats: specialseats,
			},
		});

		const data = {
			message: "Bus updated successfully",
			data: updatedBus,
		};
		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};
