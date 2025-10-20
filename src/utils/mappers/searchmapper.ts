import prisma from "../../lib/prisma.js"

export const searchMapper = async (
  searchresultGo: any[],
  from: string,
  to: string,
  godate: string,
  seats: string
): Promise<any[]> => {
  return await Promise.all(
    searchresultGo.map(async (trip: any) => {
      try {
        const cityfrom = await prisma.station.findUnique({
          where: { name: from },
          include: { city: true },
        });


        const cityto = await prisma.station.findUnique({
          where: { name: to },
          include: { city: true },
        });

        if (!cityfrom || !cityto) {
          console.error(`City details not found for From: ${from}, To: ${to}`);
          return null;
        }
        

        const bus = await prisma.bus.findUnique({ where: { id: trip.busid } });

        const StationfromDetails = trip.StationDetails.find(
          (stationDetail: any) => stationDetail.station.name === from
        );

        const StationtoDetails = trip.StationDetails.find(
          (stationDetail: any) => stationDetail.station.name === to
        );

        if (!StationfromDetails || !StationtoDetails) {
          console.error(`Station details missing for Trip ID: ${trip.id}`);
          return null;
        }

        const fare = trip.cost.find(
          (t: any) => t.fromCityId === cityfrom.city.id && t.toCityId === cityto.city.id
        );

        
  
        const Totalseats = trip.avaliableseats;
        let reservedSeats = 0 ;
        if(trip.Reservations.length > 0) {
        const [month, day, year] = godate.split("/");
				const formattedGodate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
         const ResultReservation = trip.Reservations.filter((reserve:any) => reserve.trip_date == formattedGodate ) ;
         if(ResultReservation.length > 0) {
          reservedSeats = ResultReservation[0].reservedSeats_counter ;
          console.log(reservedSeats) ;
         }
        }
        const availableseats = Totalseats - reservedSeats;
        const date = new Date(godate);
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const ArabicdaysOfWeek = [
          "الاحد",
          "الاثنين",
          "الثلاثاء",
          "الاربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ];
        const day = daysOfWeek[date.getDay()];
        const Arabicday = ArabicdaysOfWeek[date.getDay()];

        return {
          id: trip.id,
          cityfrom: cityfrom.city.name,
          Arabiccityfrom:cityfrom.city.Arabicname,
          cityto: cityto.city.name,
          Arabiccityto: cityto.city.Arabicname,
          stationfrom: from,
          Arabicstationfrom:cityfrom.Arabicname ,
          stationto: to,
          Arabicstationto: cityto.Arabicname,
          date: godate,
          day: day,
          Arabicday:Arabicday,
          seats: parseInt(seats, 10),
          details: 
            {
              bus: bus?.type || "Unknown",
              fromarrivaleTime: StationfromDetails.arrivaleTime,
              toarrivaleTime: StationtoDetails.arrivaleTime,
              payment: trip.payment,
              normalfare: fare?.fare || 0,
              specialfare: fare?.specialfare || 0,
              availableseats: availableseats,
              twowaydiscount: fare?.twowaydiscount
            },
          
        };
      } catch (error) {
        console.error(`Error processing trip ${trip.id}:`, error);
        return null;
      }
    })
  ).then(results => results.filter((trip) => trip !== null)); // Remove null values
};
