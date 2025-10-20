import { PrismaClient } from "@prisma/client";
import pkg from "rrule";
const { RRule } = pkg;

const prisma = new PrismaClient();
const from = "Nasr-City" 
const to = "Dahab";
const date = "2025-02-06";
const seats = 4;

async function search(from, to, date, seats) {
  const trips = await prisma.trip.findMany({
    include: {
      StationDetails: {
        include: { station: true }, 
      },
      cost: true,
      Reservations: true,
    },
  });

  const filteredTrips = await Promise.all(
    trips.map(async (trip) => {
      const rule = RRule.fromString(trip.rrule);
      const occurrences = rule
        .all()
        .map((occurrence) => occurrence.toISOString().split("T")[0]);

      if (!occurrences.includes(date)) return null;

      const fromTable = await prisma.station.findUnique({
        where: { name: from }, include : {city : true}
      });
  
      const toTable = await prisma.station.findUnique({
        where: { name: to } , include : {city : true},
      });

      
      const FromIndex = trip.routes.findIndex((value) => value === fromTable.city.name ) ;
      const ToIndex = trip.routes.findIndex((value) => value === toTable.city.name ) ;

      if(ToIndex < FromIndex) return null ;
      

      
      const matchingStationFrom = trip.StationDetails.some(
        (stationDetail) => stationDetail.stationId === fromTable.id
      );

      const matchingStationTo = trip.StationDetails.some(
        (stationDetail) => stationDetail.stationId === toTable.id
      );

      if (!matchingStationFrom || !matchingStationTo) return null;

     
      const reservationIndex = trip.Reservations.findIndex(
        (res) => res.trip_date === date
      );

      if (reservationIndex !== -1) {
        const reservedSeats = trip.Reservations[reservationIndex].reservedSeats_counter;
        if (trip.avaliableseats < reservedSeats + seats) return null;
      }

      return trip;
    })
  );


  return filteredTrips.filter((trip) => trip !== null);
}

(async () => {
  const result = await search(from, to, date, seats);
  console.log(result) ;
})();
