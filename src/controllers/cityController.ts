import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";

import prisma from "../lib/prisma.js"

export const GetCity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const city = await prisma.city.findMany({
			where: {
				isDeleted: false,
			},
			select: {
				id: true,
				name: true,
			},
		});

		if (!city || city.length === 0) {
			throw new CustomError("No city found", 404, "CITY_NOT_FOUND");
		}

		const data = {
			message: "City data retrieved successfully",
			data: city,
		};

		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};

export const DeleteCity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const city = await prisma.city.findUnique({
			where: {
				id: id,
			},
		});

		if (!city) {
			throw new CustomError("City not found", 404, "CITY_NOT_FOUND");
		}

		await prisma.city.update({
			where: {
				id: id,
			},
			data: {
				isDeleted: true,
				name: city.name + "_deleted" + new Date().toISOString(),
			},
		});

		const Stations = await prisma.station.findMany({ where: { cityId: id } });

		for (const station of Stations) {
			await prisma.station.update({
				where: {
					id: station.id,
				},
				data: {
					isDeleted: true,
					name: station.name + "_deleted" + new Date().toISOString(),
				},
			});
		}

		const data = {
			message: "City deleted successfully and related stations",
			data: city,
		};
		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};

export const CreateCity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.body;
	try {
		const city = await prisma.city.create({
			data: {
				name: name,
			},
		});
		const data = { message: "City created successfully", data: city };
		successResponse(res, 201, data);
	} catch (error) {
		next(error);
	}
};

export const EditCity = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const city = await prisma.city.findUnique({
			where: {
				id: id,
			},
		});

		if (!city) {
			throw new CustomError("City not found", 404, "CITY_NOT_FOUND");
		}

		const updatedCity = await prisma.city.update({
			where: {
				id: id,
			},
			data: {
				name: name,
			},
		});

		const data = {
			message: "City updated successfully",
			data: updatedCity,
		};
		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};
