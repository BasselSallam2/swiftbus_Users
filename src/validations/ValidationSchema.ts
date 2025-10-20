import { z } from "zod";

export const BusSchema = z.object({
	type: z.string().min(4),
	layout: z.string().min(4),
	seats: z.number().min(10).max(300),
	specialseats: z.array(z.number()).min(0),
});

export const CitySchema = z.object({
	name: z.string().min(2),
});

export const StationSchema = z.object({
	name: z.string().min(2),
	location: z.union([z.string().url(), z.literal("")]),
	city_id: z.string().uuid(),
	address: z.string().min(10),
});

export const MarktingLineSchema = z.object({
	from: z.string().min(2),
	to: z.string().min(2),
});
