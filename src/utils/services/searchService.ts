import prisma from "../../lib/prisma.js"
import pkg from "rrule";

const { RRule } = pkg;

import { DateTime } from "luxon";

function getEgyptTime() {
    return DateTime.now().setZone("Africa/Cairo");
}


function isBeforeDateTimeWithOffset(dateStr:any, timeStr:any, numberOfHours:any) {
    // Get current date and time
	const egyptTime = getEgyptTime();

    // Parse input date and time
    const [year, month, day] = dateStr.split('-').map(Number);
    let [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert 12-hour format to 24-hour format
    if (period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }
    
	let targetDateTime = DateTime.fromObject(
        { year, month, day, hour: hours, minute: minutes },
        { zone: "Africa/Cairo" }
    );

    // Subtract the specified number of hours
    targetDateTime = targetDateTime.minus({ hours: numberOfHours });

	

    // Compare with current date and time
    return egyptTime < targetDateTime;
}




export const searchService = async (
	godate: string,
	from: string,
	to: string,
	seats: string
) => {
	const Numberseats = parseInt(seats);

	// Fetch all trips with required relations
	const trips = await prisma.trip.findMany({ where : {inactive : false} ,
		include: {
			StationDetails: { include: { station: true } },
			cost: true,
			Reservations: true,
		},
	});

  

	const fromTable = await prisma.station.findUnique({
		where: { name: from },
		include: { city: true },
	});


  

	const toTable = await prisma.station.findUnique({
		where: { name: to },
		include: { city: true },
	});

	if (!fromTable || !toTable || !fromTable.city || !toTable.city) {
		return [];
	}

	const filteredTrips = await Promise.all(
		trips.map(async (trip) => {
			try {


				// Convert godate from MM/DD/YYYY to YYYY-MM-DD
				const [month, day, year] = godate.split("/");
				const formattedGodate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;


				
				const ArriveTest = await prisma.stationDetails.findFirst({where : {
					trip_id: trip.id , stationId : fromTable.id
				}});

				const isValid = isBeforeDateTimeWithOffset(formattedGodate , ArriveTest?.arrivaleTime , trip.expireHours) ;
				if(isValid == false) return null ;
				

				

				const rule = RRule.fromString(trip.rrule);
				const occurrences = rule
					.all()
					.map((occurrence) => occurrence.toISOString().split("T")[0]);

				if (!occurrences.includes(formattedGodate)) return null;

				const routesArray = trip.routes as string[];
				if (!routesArray || !Array.isArray(routesArray)) return null;

				const fromIndex = routesArray.indexOf(fromTable.city.id);
				const toIndex = routesArray.indexOf(toTable.city.id);

				if (fromIndex === -1 || toIndex === -1 || toIndex < fromIndex)
					return null;

				// Check if stations exist in the trip details
				const matchingStationFrom = trip.StationDetails.some(
					(stationDetail) => stationDetail.stationId === fromTable.id
				);

				const matchingStationTo = trip.StationDetails.some(
					(stationDetail) => stationDetail.stationId === toTable.id
				);

				if (!matchingStationFrom || !matchingStationTo) return null;

				// Check available seats
				const reservation = trip.Reservations.find(
					(res) => res.trip_date === formattedGodate

				);
				const reservedSeats = reservation
					? reservation.reservedSeats_counter
					: 0;


				if (trip.avaliableseats < (reservedSeats + Numberseats )) return null;

				

				return trip;
			} catch (error) {
				console.error("Error processing trip:", error);
				return null;
			}
		})
	);

	return filteredTrips.filter((trip) => trip !== null);
};
