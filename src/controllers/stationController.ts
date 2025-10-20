import { Request, Response, NextFunction } from "express";
import {successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";

import prisma from "../lib/prisma.js"

export const GetStation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const station = await prisma.station.findMany({
			where: {
				isDeleted: false,
			},
			select: {
				id: true,
				name: true,
				location: true,
				city: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!station || station.length === 0) {
			throw new CustomError("No station found", 404, "STATION_NOT_FOUND");
		}

		const data = {
			message: "Station data retrieved successfully",
			data: station,
		};

		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};

export const DeleteStation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const station = await prisma.station.findUnique({
			where: {
				id: id,
			},
		});

		if (!station) {
			throw new CustomError("Station not found", 404, "STATION_NOT_FOUND");
		}

		await prisma.station.update({
			where: {
				id: id,
			},
			data: {
				isDeleted: true,
				name: station.name + "_deleted" + new Date().toISOString(),
			},
		});

		const data = {
			message: "Station deleted successfully",
			data: station,
		};
		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};

export const CreateStation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, location, city_id, address } = req.body;
	try {
		const station = await prisma.station.create({
			data: {
				name: name,
				location: location,
				cityId: city_id,
				address: address,
			},
		});
		const data = { message: "Station created successfully", data: station };
		successResponse(res, 201, data);
	} catch (error) {
		next(error);
	}
};

export const EditStation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { name, location, city_id, address } = req.body;

		const station = await prisma.station.findUnique({
			where: {
				id: id,
			},
		});

		if (!station) {
			throw new CustomError("Station not found", 404, "STATION_NOT_FOUND");
		}

		const updatedStation = await prisma.station.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				location: location,
				cityId: city_id,
				address: address,
			},
		});

		const data = {
			message: "Station updated successfully",
			data: updatedStation,
		};
		successResponse(res, 200, data);
	} catch (error) {
		next(error);
	}
};
