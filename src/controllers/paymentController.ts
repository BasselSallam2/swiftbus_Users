import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

const Cashpayment = async (PaymentData: any) => {
	try {
		const {
			trip_id,
			date,
			name,
			station_from,
			station_to,
			city_to,
			city_from,
			chairs,
			chairsQTY,
			voucher,
			paymentmethod,
			take_off,
			arrive,
			price,
			payid,
		} = PaymentData;
		let { phone } = PaymentData;
		phone = phone
			.replace(/\s+/g, "")
			.replace(/[٠-٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
			.replace(/^(\+20|20|\+2|2)/, "0");

		const ReservedCounter = parseInt(chairsQTY);

		if (process.env.SENDGRID_API_KEY) {
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		} else {
			throw new Error("SENDGRID_API_KEY is not defined");
		}

		let actucalreservation;
		const Reservations = await prisma.reservation.findFirst({
			where: { trip_date: date, trip_id: trip_id },
		});
		if (!Reservations) {
			const newReservation = await prisma.reservation.create({
				data: {
					trip_id: trip_id,
					trip_date: date,
					reservedSeats_counter: ReservedCounter,
					reservedSeats: chairs,
				},
			});
			actucalreservation = newReservation;
		} else {
			actucalreservation = Reservations;
			const chairsArray = Reservations.reservedSeats as number[] | null;
			chairsArray!.push(...(chairs as number[]));
			const updateReservation = await prisma.reservation.update({
				where: { id: Reservations.id },
				data: {
					reservedSeats_counter:
						Reservations.reservedSeats_counter + ReservedCounter,
					reservedSeats: chairsArray || [],
				},
			});
		}

		let actualCoustmer;
		const Coustmer = await prisma.coustmer.findUnique({
			where: { phone: phone },
		});
		if (!Coustmer) {
			const NewCoustmer = await prisma.coustmer.create({
				data: { name: name, phone: phone },
			});
			actualCoustmer = NewCoustmer;
		} else {
			actualCoustmer = Coustmer;
		}
		let actualvoucher;
		if (voucher.length > 0) {
			const usedvoucher = await prisma.voucher.findUnique({
				where: { code: voucher },
			});
			actualvoucher = usedvoucher;
			await prisma.voucher.update({
				where: { id: usedvoucher?.id },
				data: { consumed: { increment: 1 } },
			});
		}

		const NewTicket = await prisma.ticket.create({
			data: {
				trip_id: trip_id,
				pay_id: payid,
				trip_date: date,
				Coustmer_id: actualCoustmer.id,
				status: "Pending",
				paymentMethod: paymentmethod,
				seatsCounter: ReservedCounter,
				seats: chairs,
				reservation_id: actucalreservation.id,
				CityRoutes: [city_from, city_to],
				StationRoutes: [station_from, station_to],
				voucher_id: actualvoucher?.id || null,
				takeoff: take_off,
				arrive: arrive,
				price: price,
				settledprice: 0,
			},
		});
		const firstStation = await prisma.station.findFirst({
			where: { name: station_from },
			select: { Arabicname: true },
		});
		const secondStation = await prisma.station.findFirst({
			where: { name: station_to },
			select: { Arabicname: true },
		});
		const TAKEOFFTYPE = take_off.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
		const TAKEOFF = `${take_off.split(" ")[0]} ${TAKEOFFTYPE}`;
		const ARRIVETYPE = arrive.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
		const ARRIVE = `${arrive.split(" ")[0]} ${ARRIVETYPE}`;
		const whats = await prisma.whatsapp.findFirst();
		const data = {
			client_id: whats?.client,
			mobile: `+2${actualCoustmer.phone}`,
			text: `تم حجز تذكرتك بنجاح و رقم التذكرة هو ${NewTicket.ticket_code}
ب اسم ${actualCoustmer.name}
تليفون ${actualCoustmer.phone}
وسيلة الدفع ${NewTicket.paymentMethod}
سعر التذكرة ${NewTicket.price} جنيه
عدد المسافرين : ${NewTicket.seatsCounter} 
نوع التذكرة: ذهاب فقط 
رقم الكراسي : ${NewTicket.seats}

تفاصيل الرحلة:
محطة الركوب ${firstStation?.Arabicname} الساعه${TAKEOFF} بتاريخ ${date}
محطة الوصول ${secondStation?.Arabicname}  الساعه ${ARRIVE} 

برجاء الاحتفاظ بالتذكرة: 
https://www.swiftbusegypt.com/ticket?id=${NewTicket.pay_id}`,
		};

		const whatsappMSG = await fetch(
			"https://v2.whats360.live/api/user/v2/send_message",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						`Bearer ${whats?.token}`,
				},
				body: JSON.stringify(data),
			}
		);

		const msg = {
			to: "dahabawybus@gmail.com",
			from: "	bassela.sallam@gmail.com",
			subject: `🚌 New Cash Single Reservation (#${NewTicket.ticket_code})`,
			html: `
	<div style="font-family:Arial, sans-serif;max-width:600px;margin:auto;background:#f7f7f7;padding:20px;border-radius:10px;">
	  <h2 style="color:#333;">🎟️ New Reservation Received!</h2>
	  <p>You've received a new <strong>cash reservation</strong>. Here are the details:</p>
	  <table style="width:100%;border-collapse:collapse;">
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Ticket Number:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">#${NewTicket.ticket_code}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Trip ID:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${trip_id}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Customer name:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${actualCoustmer.name}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Customer phone:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${actualCoustmer.phone}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Trip Date:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${date}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Departure:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${take_off}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Arrival:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${arrive}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Route:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${city_from} → ${city_to}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Stations:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${station_from} → ${station_to}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Seats Reserved:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${ReservedCounter} (${chairs})</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Voucher:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${actualvoucher?.code || "None"}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Total Price:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${price}</td>
		</tr>
		<tr>
		  <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Payment Method:</strong></td>
		  <td style="padding:8px;border-bottom:1px solid #ddd;">${paymentmethod}</td>
		</tr>
		<tr>
		  <td style="padding:8px;"><strong>Status:</strong></td>
		  <td style="padding:8px;color:#d9534f;"><strong>Cash Pending</strong></td>
		</tr>
	  </table>
	  <p style="margin-top:20px;">
		Please follow up to confirm payment and finalize this reservation.
	  </p>
	  <p style="color:#888;font-size:12px;">
		This is an automated message from your booking system.
	  </p>
	</div>
	`,
		};

		await sgMail.send(msg);
	} catch (error) {
		console.log(error);
	}
};

const DoubleCashpayment = async (PaymentData: any) => {
	try {
		const {
			trip_id1,
			trip_id2,
			date1,
			date2,
			name,
			station_from1,
			station_from2,
			station_to1,
			station_to2,
			city_to1,
			city_to2,
			city_from1,
			city_from2,
			chairs1,
			chairs2,
			chairsQTY,
			paymentmethod,
			take_off1,
			take_off2,
			arrive1,
			arrive2,
			discount,
			price,
			oldprice,
			payid,
		} = PaymentData;

		let { phone } = PaymentData;
		phone = phone
			.replace(/\s+/g, "")
			.replace(/[٠-٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
			.replace(/^(\+20|20|\+2|2)/, "0");

		if (process.env.SENDGRID_API_KEY) {
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		} else {
			throw new Error("SENDGRID_API_KEY is not defined");
		}

		const ReservedCounter = parseInt(chairsQTY);

		let actucalreservation1;
		const Reservations1 = await prisma.reservation.findFirst({
			where: { trip_date: date1, trip_id: trip_id1 },
		});

		if (!Reservations1) {
			const newReservation1 = await prisma.reservation.create({
				data: {
					trip_id: trip_id1,
					trip_date: date1,
					reservedSeats_counter: ReservedCounter,
					reservedSeats: chairs1,
				},
			});
			actucalreservation1 = newReservation1;
		} else {
			actucalreservation1 = Reservations1;
			const chairsArray = Reservations1.reservedSeats as number[] | null;
			chairsArray!.push(...(chairs1 as number[]));
			const updateReservation1 = await prisma.reservation.update({
				where: { id: Reservations1.id },
				data: {
					reservedSeats_counter:
						Reservations1.reservedSeats_counter + ReservedCounter,
					reservedSeats: chairsArray || [],
				},
			});
		}

		let actucalreservation2;
		const Reservations2 = await prisma.reservation.findFirst({
			where: { trip_date: date2, trip_id: trip_id2 },
		});
		if (!Reservations2) {
			const newReservation2 = await prisma.reservation.create({
				data: {
					trip_id: trip_id2,
					trip_date: date2,
					reservedSeats_counter: ReservedCounter,
					reservedSeats: chairs2,
				},
			});
			actucalreservation2 = newReservation2;
		} else {
			actucalreservation2 = Reservations2;
			const chairsArray = Reservations2.reservedSeats as number[] | null;
			chairsArray!.push(...(chairs2 as number[]));
			const updateReservation2 = await prisma.reservation.update({
				where: { id: Reservations2.id },
				data: {
					reservedSeats_counter:
						Reservations2.reservedSeats_counter + ReservedCounter,
					reservedSeats: chairsArray || [],
				},
			});
		}

		let actualCoustmer;
		const Coustmer = await prisma.coustmer.findUnique({
			where: { phone: phone },
		});
		if (!Coustmer) {
			const NewCoustmer = await prisma.coustmer.create({
				data: { name: name, phone: phone },
			});
			actualCoustmer = NewCoustmer;
		} else {
			actualCoustmer = Coustmer;
		}

		const NewTicket = await prisma.ticket.create({
			data: {
				trip_id: trip_id1,
				Back_trip_id: trip_id2,
				pay_id: payid,
				trip_date: date1,
				Back_trip_date: date2,
				Coustmer_id: actualCoustmer.id,
				status: "Pending",
				paymentMethod: paymentmethod,
				seatsCounter: ReservedCounter,
				seats: chairs1,
				Backseats: chairs2,
				reservation_id: actucalreservation1.id,
				Backreservation_id: actucalreservation2.id,
				settledprice: 0,

				CityRoutes: [city_from1, city_to1],
				Back_CityRoutes: [city_from2, city_to2],
				StationRoutes: [station_from1, station_to1],
				Back_StationRoutes: [station_from2, station_to2],
				takeoff: take_off1,
				Back_takeoff: take_off2,
				arrive: arrive1,
				Back_arrive: arrive2,
				price: price,
			},
		});

		const firstStation1 = await prisma.station.findFirst({
			where: { name: station_from1 },
			select: { Arabicname: true },
		});
		const secondStation1 = await prisma.station.findFirst({
			where: { name: station_to1 },
			select: { Arabicname: true },
		});
		const TAKEOFFTYPE1 = take_off1.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
		const TAKEOFF1 = `${take_off1.split(" ")[0]} ${TAKEOFFTYPE1}`;
		const ARRIVETYPE1 = arrive1.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
		const ARRIVE1 = `${arrive1.split(" ")[0]} ${ARRIVETYPE1}`;

		const firstStation2 = await prisma.station.findFirst({
			where: { name: station_from2 },
			select: { Arabicname: true },
		});
		const secondStation2 = await prisma.station.findFirst({
			where: { name: station_to2 },
			select: { Arabicname: true },
		});
		const TAKEOFFTYPE2 = take_off2.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
		const TAKEOFF2 = `${take_off2.split(" ")[0]} ${TAKEOFFTYPE2}`;
		const ARRIVETYPE2 = arrive2.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
		const ARRIVE2 = `${arrive2.split(" ")[0]} ${ARRIVETYPE2}`;
		const whats = await prisma.whatsapp.findFirst();
		const data = {
			client_id: whats?.client ,
			mobile: `+2${actualCoustmer.phone}`,
			text: `تم حجز تذكرتك بنجاح و رقم التذكرة هو ${NewTicket.ticket_code}
ب اسم ${actualCoustmer.name}
تليفون ${actualCoustmer.phone}
وسيلة الدفع ${NewTicket.paymentMethod}
سعر التذكرة ${NewTicket.price} جنيه
عدد المسافرين : ${NewTicket.seatsCounter} 
نوع التذكرة: ذهاب و عودة 
رقم كراسي الذهاب: ${chairs1}
رقم كراسي العودة: ${chairs2}

تفاصيل رحلة الذهاب:
محطة الركوب ${firstStation1?.Arabicname} الساعه${TAKEOFF1} بتاريخ ${date1}
محطة الوصول ${secondStation1?.Arabicname}  الساعه ${ARRIVE1} 

تفاصيل رحلة العودة:
محطة الركوب ${firstStation2?.Arabicname} الساعه${TAKEOFF2} بتاريخ ${date2}
محطة الوصول ${secondStation2?.Arabicname}  الساعه ${ARRIVE2}

برجاء الاحتفاظ بالتذكرة: 
https://www.swiftbusegypt.com/ticket?id=${NewTicket.pay_id}`,
		};

		const whatsappMSG = await fetch(
			"https://v2.whats360.live/api/user/v2/send_message",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						`Bearer ${whats?.token}`,
				},
				body: JSON.stringify(data),
			}
		);

		const msg = {
			to: "dahabawybus@gmail.com",
			from: "bassela.sallam@gmail.com",
			subject: `🚌 New Cash Double Reservation (#${NewTicket.ticket_code})`,
			html: `
				<div style="font-family:Arial, sans-serif;max-width:650px;margin:auto;background:#f7f7f7;padding:20px;border-radius:10px;">
				  <h2 style="color:#333;">🎟️ New Double Reservation Received!</h2>
				  <p>You've received a new <strong>cash reservation (Round Trip)</strong>. Here are the complete details:</p>
			  
				  <h3 style="color:#007bff;">➡️ Going Trip</h3>
				  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr><td><strong>Trip Date:</strong></td><td>${date1}</td></tr>
					<tr><td><strong>Departure:</strong></td><td>${take_off1}</td></tr>
					<tr><td><strong>Arrival:</strong></td><td>${arrive1}</td></tr>
					<tr><td><strong>Route:</strong></td><td>${city_from1} → ${city_to1}</td></tr>
					<tr><td><strong>Stations:</strong></td><td>${station_from1} → ${station_to1}</td></tr>
					<tr><td><strong>Seats Reserved:</strong></td><td>${ReservedCounter} (${chairs1})</td></tr>
				  </table>
			  
				  <h3 style="color:#28a745;">⬅️ Return Trip</h3>
				  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr><td><strong>Trip Date:</strong></td><td>${date2}</td></tr>
					<tr><td><strong>Departure:</strong></td><td>${take_off2}</td></tr>
					<tr><td><strong>Arrival:</strong></td><td>${arrive2}</td></tr>
					<tr><td><strong>Route:</strong></td><td>${city_from2} → ${city_to2}</td></tr>
					<tr><td><strong>Stations:</strong></td><td>${station_from2} → ${station_to2}</td></tr>
					<tr><td><strong>Seats Reserved:</strong></td><td>${ReservedCounter} (${chairs2})</td></tr>
				  </table>
			  
				  <h3 style="color:#333;">📌 Customer & Payment Info</h3>
				  <table style="width:100%;border-collapse:collapse;">
					<tr><td><strong>Ticket Number:</strong></td><td>#${NewTicket.ticket_code}</td></tr>
					<tr><td><strong>Customer Name:</strong></td><td>${actualCoustmer.name}</td></tr>
					<tr><td><strong>Customer Phone:</strong></td><td>${actualCoustmer.phone}</td></tr>
					<tr><td><strong>Total Price:</strong></td><td>${price}</td></tr>
					<tr><td><strong>Payment Method:</strong></td><td>${paymentmethod}</td></tr>
					<tr><td><strong>Status:</strong></td><td style="color:#d9534f;"><strong>Cash Pending</strong></td></tr>
				  </table>
			  
				  <p style="margin-top:20px;">
					Please follow up promptly to confirm the payment and finalize this double reservation.
				  </p>
				  <p style="color:#888;font-size:12px;">
					This is an automated message from your booking system.
				  </p>
				</div>
				`,
		};

		await sgMail.send(msg);
	} catch (error) {
		console.log(error);
	}
};

export const paymentCallback = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.body.obj.payment_key_claims.extra.details.trip_id2) {
			const {
				trip_id,
				date,
				name,
				station_from,
				station_to,
				city_to,
				city_from,
				chairs,
				chairsQTY,
				voucher,
				paymentmethod,
				take_off,
				arrive,
				price,
			} = req.body.obj.payment_key_claims.extra.details;
			let { phone } = req.body.obj.payment_key_claims.extra.details;

			phone = phone
				.replace(/\s+/g, "")
				.replace(/[٠-٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
				.replace(/^(\+20|20|\+2|2)/, "0");
			const { success, id } = req.body.obj;
			const ReservedCounter = parseInt(chairsQTY);
			if (!success || success == false) {
				return res.render("VFfail");
			}
			let actucalreservation;
			const Reservations = await prisma.reservation.findFirst({
				where: { trip_date: date, trip_id: trip_id },
			});
			if (!Reservations) {
				const newReservation = await prisma.reservation.create({
					data: {
						trip_id: trip_id,
						trip_date: date,
						reservedSeats_counter: ReservedCounter,
						reservedSeats: chairs,
					},
				});
				actucalreservation = newReservation;
			} else {
				actucalreservation = Reservations;
				const chairsArray = Reservations.reservedSeats as number[] | null;
				chairsArray!.push(...(chairs as number[]));
				const updateReservation = await prisma.reservation.update({
					where: { id: Reservations.id },
					data: {
						reservedSeats_counter:
							Reservations.reservedSeats_counter + ReservedCounter,
						reservedSeats: chairsArray || [],
					},
				});
			}

			let actualCoustmer;
			const Coustmer = await prisma.coustmer.findUnique({
				where: { phone: phone },
			});
			if (!Coustmer) {
				const NewCoustmer = await prisma.coustmer.create({
					data: { name: name, phone: phone },
				});
				actualCoustmer = NewCoustmer;
			} else {
				actualCoustmer = Coustmer;
			}
			let actualvoucher;
			if (voucher.length > 0) {
				const usedvoucher = await prisma.voucher.findUnique({
					where: { code: voucher },
				});
				const increasevoucher = await prisma.voucher.update({
					where: { code: voucher },
					data: { consumed: { increment: 1 } },
				});
				actualvoucher = usedvoucher;
			}

			const NewTicket = await prisma.ticket.create({
				data: {
					trip_id: trip_id,
					pay_id: id,
					trip_date: date,
					Coustmer_id: actualCoustmer.id,
					status: "Booked",
					paymentMethod: paymentmethod,
					seatsCounter: ReservedCounter,
					seats: chairs,
					reservation_id: actucalreservation.id,
					CityRoutes: [city_from, city_to],
					StationRoutes: [station_from, station_to],
					voucher_id: actualvoucher?.id || null,
					takeoff: take_off,
					arrive: arrive,
					price: price,
				},
			});

			const firstStation = await prisma.station.findFirst({
				where: { name: station_from },
				select: { Arabicname: true },
			});
			const secondStation = await prisma.station.findFirst({
				where: { name: station_to },
				select: { Arabicname: true },
			});
			const TAKEOFFTYPE = take_off.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
			const TAKEOFF = `${take_off.split(" ")[0]} ${TAKEOFFTYPE}`;
			const ARRIVETYPE = arrive.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
			const ARRIVE = `${arrive.split(" ")[0]} ${ARRIVETYPE}`;
			const whats = await prisma.whatsapp.findFirst();	
			const data = {
				client_id:whats?.client ,
				mobile: `+2${actualCoustmer.phone}`,
				text: `تم حجز تذكرتك بنجاح و رقم التذكرة هو ${NewTicket.ticket_code}
ب اسم ${actualCoustmer.name}
تليفون ${actualCoustmer.phone}
وسيلة الدفع ${NewTicket.paymentMethod}
سعر التذكرة ${NewTicket.price} جنيه
عدد المسافرين : ${NewTicket.seatsCounter} 
نوع التذكرة: ذهاب فقط 
رقم الكراسي: ${NewTicket.seats}

تفاصيل الرحلة:
محطة الركوب ${firstStation?.Arabicname} الساعه${TAKEOFF} بتاريخ ${date}
محطة الوصول ${secondStation?.Arabicname}  الساعه ${ARRIVE} 

برجاء الاحتفاظ بالتذكرة: 
https://www.swiftbusegypt.com/ticket?id=${NewTicket.pay_id}`,
			};

			const whatsappMSG = await fetch(
				"https://v2.whats360.live/api/user/v2/send_message",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization:
							`Bearer ${whats?.token}`,
					},
					body: JSON.stringify(data),
				}
			);
		} else {
			const {
				trip_id1,
				trip_id2,
				date1,
				date2,
				name,
				phone,
				station_from1,
				station_from2,
				station_to1,
				station_to2,
				city_to1,
				city_to2,
				city_from1,
				city_from2,
				chairs1,
				chairs2,
				chairsQTY,
				paymentmethod,
				take_off1,
				take_off2,
				arrive1,
				arrive2,
				discount,
				price,
				oldprice,
			} = req.body.obj.payment_key_claims.extra.details;

			const { success, id } = req.body.obj;
			const ReservedCounter = parseInt(chairsQTY);
			if (!success || success == false) {
				return res.redirect("/");
			}
			let actucalreservation1;
			let actucalreservation2;

			const Reservations1 = await prisma.reservation.findFirst({
				where: { trip_date: date1, trip_id: trip_id1 },
			});
			if (!Reservations1) {
				const newReservation1 = await prisma.reservation.create({
					data: {
						trip_id: trip_id1,
						trip_date: date1,
						reservedSeats_counter: ReservedCounter,
						reservedSeats: chairs1,
					},
				});
				actucalreservation1 = newReservation1;
			} else {
				actucalreservation1 = Reservations1;
				const chairsArray = Reservations1.reservedSeats as number[] | null;
				chairsArray!.push(...(chairs1 as number[]));
				const updateReservation = await prisma.reservation.update({
					where: { id: Reservations1.id },
					data: {
						reservedSeats_counter:
							Reservations1.reservedSeats_counter + ReservedCounter,
						reservedSeats: chairsArray || [],
					},
				});
			}

			const Reservations2 = await prisma.reservation.findFirst({
				where: { trip_date: date2, trip_id: trip_id2 },
			});
			if (!Reservations2) {
				const newReservation2 = await prisma.reservation.create({
					data: {
						trip_id: trip_id2,
						trip_date: date2,
						reservedSeats_counter: ReservedCounter,
						reservedSeats: chairs2,
					},
				});
				actucalreservation2 = newReservation2;
			} else {
				actucalreservation2 = Reservations2;
				const chairsArray = Reservations2.reservedSeats as number[] | null;
				chairsArray!.push(...(chairs2 as number[]));
				const updateReservation = await prisma.reservation.update({
					where: { id: Reservations2.id },
					data: {
						reservedSeats_counter:
							Reservations2.reservedSeats_counter + ReservedCounter,
						reservedSeats: chairsArray || [],
					},
				});
			}

			let actualCoustmer;
			const Coustmer = await prisma.coustmer.findUnique({
				where: { phone: phone },
			});
			if (!Coustmer) {
				const NewCoustmer = await prisma.coustmer.create({
					data: { name: name, phone: phone },
				});
				actualCoustmer = NewCoustmer;
			} else {
				actualCoustmer = Coustmer;
			}

			const NewTicket = await prisma.ticket.create({
				data: {
					trip_id: trip_id1,
					Back_trip_id: trip_id2,
					pay_id: id,
					trip_date: date1,
					Back_trip_date: date2,
					Coustmer_id: actualCoustmer.id,
					status: "cash pending",
					paymentMethod: paymentmethod,
					seatsCounter: ReservedCounter,
					seats: chairs1,
					Backseats: chairs2,
					reservation_id: actucalreservation1.id,
					Backreservation_id: actucalreservation2.id,

					CityRoutes: [city_from1, city_to1],
					Back_CityRoutes: [city_from2, city_to2],
					StationRoutes: [station_from1, station_to1],
					Back_StationRoutes: [station_from2, station_to2],
					takeoff: take_off1,
					Back_takeoff: take_off2,
					arrive: arrive1,
					Back_arrive: arrive2,
					price: price,
				},
			});

			const firstStation1 = await prisma.station.findFirst({
				where: { name: station_from1 },
				select: { Arabicname: true },
			});
			const secondStation1 = await prisma.station.findFirst({
				where: { name: station_to1 },
				select: { Arabicname: true },
			});
			const TAKEOFFTYPE1 =
				take_off1.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
			const TAKEOFF1 = `${take_off1.split(" ")[0]} ${TAKEOFFTYPE1}`;
			const ARRIVETYPE1 = arrive1.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
			const ARRIVE1 = `${arrive1.split(" ")[0]} ${ARRIVETYPE1}`;

			const firstStation2 = await prisma.station.findFirst({
				where: { name: station_from2 },
				select: { Arabicname: true },
			});
			const secondStation2 = await prisma.station.findFirst({
				where: { name: station_to2 },
				select: { Arabicname: true },
			});
			const TAKEOFFTYPE2 =
				take_off2.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
			const TAKEOFF2 = `${take_off2.split(" ")[0]} ${TAKEOFFTYPE2}`;
			const ARRIVETYPE2 = arrive2.split(" ")[1] === "AM" ? "صباحاً" : `مساءً`;
			const ARRIVE2 = `${arrive2.split(" ")[0]} ${ARRIVETYPE2}`;
			const whats = await prisma.whatsapp.findFirst();
			const data = {
				client_id:whats?.client ,
				mobile: `+2${actualCoustmer.phone}`,
				text: `تم حجز تذكرتك بنجاح و رقم التذكرة هو ${NewTicket.ticket_code}
ب اسم ${actualCoustmer.name}
تليفون ${actualCoustmer.phone}
وسيلة الدفع ${NewTicket.paymentMethod}
سعر التذكرة ${NewTicket.price} جنيه
عدد المسافرين : ${NewTicket.seatsCounter} 
نوع التذكرة: ذهاب و عودة 
رقم كراسي الذهاب: ${NewTicket.seats}
رقم كراسي العودة: ${NewTicket.Backseats}

تفاصيل رحلة الذهاب:
محطة الركوب ${firstStation1?.Arabicname} الساعه${TAKEOFF1} بتاريخ ${date1}
محطة الوصول ${secondStation1?.Arabicname}  الساعه ${ARRIVE1} 

تفاصيل رحلة العودة:
محطة الركوب ${firstStation2?.Arabicname} الساعه${TAKEOFF2} بتاريخ ${date2}
محطة الوصول ${secondStation2?.Arabicname}  الساعه ${ARRIVE2}

برجاء الاحتفاظ بالتذكرة: 
https://www.swiftbusegypt.com/ticket?id=${NewTicket.pay_id}`,
			};

			const whatsappMSG = await fetch(
				"https://v2.whats360.live/api/user/v2/send_message",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization:
							`Bearer ${whats?.token}`,
					},
					body: JSON.stringify(data),
				}
			);
		}
	} catch (error) {
		next(error);
	}
};

export const paymobPay = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			action,
			name,
			trip_id,
			date,
			station_from,
			station_to,
			voucher,
			chairs,
			chairsQTY,
			city_from,
			city_to,
			take_off,
			arrive,
		} = req.body;

		let { phone } = req.body;
		phone = phone
			.replace(/\s+/g, "")
			.replace(/[٠-٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
			.replace(/^(\+20|20|\+2|2)/, "0");

		const loweraction = action.toLowerCase();
		const pk_key = process.env.pk_key;
		const ReservedChairs = JSON.parse(chairs);

		// Convert godate from MM/DD/YYYY to YYYY-MM-DD
		const [month, day, year] = date.split("/");
		const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

		const Trip = await prisma.trip.findUnique({
			where: { id: trip_id },
			include: { Bus: true },
		});

		const cityfrom = await prisma.city.findUnique({
			where: { name: city_from },
		});
		const cityto = await prisma.city.findUnique({ where: { name: city_to } });

		const isFingerprint = await prisma.fingerprint.findUnique({
			where: { fingerprint: req.fingerprint?.hash },
		});
		if (isFingerprint) {
			return res.render("wait");
		}

		//go back if there is reservation with the same seat
		const OldReservations = await prisma.reservation.findFirst({
			where: { trip_id: trip_id, trip_date: formattedDate },
		});
		if (OldReservations) {
			const reservedSeatsArray = OldReservations.reservedSeats as number[];
			const isReserved: boolean = ReservedChairs.some((chair: number) =>
				reservedSeatsArray!.includes(chair)
			);
			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldtempReservations = await prisma.tempReservation.findFirst({
			where: { trip_id: trip_id, trip_date: formattedDate },
		});
		if (OldtempReservations) {
			const reservedSeatsArray = OldtempReservations.reservedSeats as number[];
			const isReserved: boolean = ReservedChairs.some((chair: number) =>
				reservedSeatsArray!.includes(chair)
			);

			if (isReserved) {
				return res.redirect("/");
			}
		}

		const cost = await prisma.cost.findFirst({
			where: {
				trip_id: trip_id,
				fromCityId: cityfrom?.id,
				toCityId: cityto?.id,
			},
		});
		let totalprice;
		if (ReservedChairs.includes(1) && Trip?.Bus.type == "HI-ACE") {
			const Diffrence = (cost?.specialfare || 1) - (cost?.fare || 1);
			totalprice = cost!.fare * chairsQTY + Diffrence;
		} else {
			totalprice = cost!.fare * chairsQTY;
		}
		let finalprice = totalprice;
		if (voucher.length > 0) {
			const DBvoucher = await prisma.voucher.findUnique({
				where: { code: voucher, isActive: true },
			});
			if (DBvoucher) {
				const discount = totalprice * (DBvoucher.percentage / 100);
				finalprice =
					discount > DBvoucher.maximum
						? totalprice - DBvoucher.maximum
						: totalprice - discount;
			}
		}

		//check if it's cash
		if (action == "cash") {
			const payid = Date.now() * 1000 + Math.floor(Math.random() * 1000);
			const paymentData = {
				trip_type: "single",
				trip_id: trip_id,
				date: formattedDate,
				name: name,
				phone: phone,
				station_from: station_from,
				station_to: station_to,
				city_to: city_to,
				city_from: city_from,
				chairs: ReservedChairs,
				chairsQTY: chairsQTY,
				voucher: voucher,
				paymentmethod: action,
				take_off: take_off,
				arrive: arrive,
				price: finalprice,
				payid: payid,
			};
			await Cashpayment(paymentData);
			return res.redirect(`/ticket?id=${payid}`);
		}

		let integrationID;
		if (action == "visa") {
			integrationID = 4927399;
		} else if (action == "VFcash") {
			integrationID = 4927400;
		}

		const data = {
			amount: finalprice * 100,
			currency: "EGP",
			payment_methods: [integrationID],
			items: [
				{
					name: "Bus Reservation",
					amount: finalprice * 100,
					description: "Reservation for bus ride inside egypt",
					quantity: 1,
				},
			],
			billing_data: {
				apartment: "dumy",
				first_name: name,
				last_name: "none",
				street: "dumy",
				building: "dumy",
				phone_number: "01100725449",
				city: "dumy",
				country: "dumy",
				email: "dahabawybus@gmail.com",
				floor: "dumy",
				state: "dumy",
			},
			extras: {
				details: {
					trip_type: "single",
					trip_id: trip_id,
					date: formattedDate,
					name: name,
					phone: phone,
					station_from: station_from,
					station_to: station_to,
					city_to: city_to,
					city_from: city_from,
					chairs: ReservedChairs,
					chairsQTY: chairsQTY,
					voucher: voucher,
					paymentmethod: action,
					take_off: take_off,
					arrive: arrive,
					price: finalprice,
				},
			},
		};

		const headers = {
			Authorization: `Bearer ${process.env.SECRET_KEY}`,
			"Content-Type": "application/json",
		};

		if (OldtempReservations) {
			const updatedReservedSeats = OldtempReservations.reservedSeats as
				| number[]
				| null;

			updatedReservedSeats!.push(...ReservedChairs);

			await prisma.tempReservation.update({
				where: { id: OldtempReservations.id },
				data: {
					reservedSeats_counter:
						OldtempReservations.reservedSeats_counter + ReservedChairs.length,
					reservedSeats: updatedReservedSeats || [],
				},
			});
		} else {
			const TempReserve = await prisma.tempReservation.create({
				data: {
					trip_id: trip_id,
					trip_date: formattedDate,
					reservedSeats_counter: +chairsQTY,
					reservedSeats: ReservedChairs,
				},
			});
		}

		// const newfingerprint = await prisma.fingerprint.create({data : {
		// 	fingerprint : req.fingerprint?.hash || "Null"
		// }});

		axios
			.post("https://accept.paymob.com/v1/intention/", data, { headers })
			.then((response) => {
				const SECRET_CLIENT = response.data.client_secret;
				res.redirect(
					`https://accept.paymob.com/unifiedcheckout/?publicKey=${pk_key}&clientSecret=${SECRET_CLIENT}`
				);
			})
			.catch((error) => {
				console.error(
					"Paymob API Error:",
					error.response?.data || error.message
				);
				res.status(400).json({
					error: "Payment request failed",
					details: error.response?.data,
				});
			});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const doublepaymobPay = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			action,
			name,
			trip_id1,
			trip_id2,
			date1,
			date2,
			station_from1,
			station_from2,
			station_to1,
			station_to2,
			chairs1,
			chairs2,
			chairsQTY,
			city_from1,
			city_from2,
			city_to1,
			city_to2,
			take_off1,
			take_off2,
			arrive1,
			arrive2,
		} = req.body;
		let { phone } = req.body;

		phone = phone
			.replace(/\s+/g, "")
			.replace(/[٠-٩]/g, (d: string) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
			.replace(/^(\+20|20|\+2|2)/, "0");

		const loweraction = action.toLowerCase();
		const pk_key = process.env.pk_key;
		const ReservedChairs1 = JSON.parse(chairs1);
		const ReservedChairs2 = JSON.parse(chairs2);

		// Convert godate from MM/DD/YYYY to YYYY-MM-DD
		const [month1, day1, year1] = date1.split("/");
		const formattedDate1 = `${year1}-${month1.padStart(2, "0")}-${day1.padStart(2, "0")}`;

		const [month2, day2, year2] = date2.split("/");
		const formattedDate2 = `${year2}-${month2.padStart(2, "0")}-${day2.padStart(2, "0")}`;

		const Trip1 = await prisma.trip.findUnique({
			where: { id: trip_id1 },
			include: { Bus: true },
		});

		const Trip2 = await prisma.trip.findUnique({
			where: { id: trip_id2 },
			include: { Bus: true },
		});

		const cityfrom1 = await prisma.city.findUnique({
			where: { name: city_from1 },
		});

		const cityfrom2 = await prisma.city.findUnique({
			where: { name: city_from2 },
		});

		const cityto1 = await prisma.city.findUnique({ where: { name: city_to1 } });

		const cityto2 = await prisma.city.findUnique({ where: { name: city_to2 } });

		const isFingerprint = await prisma.fingerprint.findUnique({
			where: { fingerprint: req.fingerprint?.hash },
		});
		if (isFingerprint) {
			return res.render("wait");
		}

		//go back if there is reservation with the same seat
		const OldReservations1 = await prisma.reservation.findFirst({
			where: { trip_id: trip_id1, trip_date: formattedDate1 },
		});

		if (OldReservations1) {
			const reservedSeatsArray = OldReservations1.reservedSeats as number[];
			const isReserved: boolean = ReservedChairs1.some((chair: number) =>
				reservedSeatsArray!.includes(chair)
			);
			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldReservations2 = await prisma.reservation.findFirst({
			where: { trip_id: trip_id2, trip_date: formattedDate2 },
		});

		if (OldReservations2) {
			const reservedSeatsArray = OldReservations2.reservedSeats as number[];
			const isReserved: boolean = ReservedChairs2.some((chair: number) =>
				reservedSeatsArray!.includes(chair)
			);
			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldtempReservations1 = await prisma.tempReservation.findFirst({
			where: { trip_id: trip_id1, trip_date: formattedDate1 },
		});
		if (OldtempReservations1) {
			const reservedSeatsArray = OldtempReservations1.reservedSeats as number[];
			const isReserved: boolean = ReservedChairs1.some((chair: number) =>
				reservedSeatsArray!.includes(chair)
			);

			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldtempReservations2 = await prisma.tempReservation.findFirst({
			where: { trip_id: trip_id2, trip_date: formattedDate2 },
		});
		if (OldtempReservations2) {
			const reservedSeatsArray = OldtempReservations2.reservedSeats as number[];
			const isReserved: boolean = ReservedChairs2.some((chair: number) =>
				reservedSeatsArray!.includes(chair)
			);

			if (isReserved) {
				return res.redirect("/");
			}
		}

		const cost1 = await prisma.cost.findFirst({
			where: {
				trip_id: trip_id1,
				fromCityId: cityfrom1?.id,
				toCityId: cityto1?.id,
			},
		});

		const cost2 = await prisma.cost.findFirst({
			where: {
				trip_id: trip_id2,
				fromCityId: cityfrom2?.id,
				toCityId: cityto2?.id,
			},
		});

		let totalprice;

		if (ReservedChairs1.includes(1) && Trip1?.Bus.type == "HI-ACE") {
			const Diffrence = (cost1?.specialfare || 1) - (cost1?.fare || 1);
			totalprice = cost1!.fare * chairsQTY + Diffrence;
		} else {
			totalprice = cost1!.fare * chairsQTY;
		}

		if (ReservedChairs2.includes(1) && Trip2?.Bus.type == "HI-ACE") {
			const Diffrence = (cost2?.specialfare || 1) - (cost2?.fare || 1);
			totalprice = totalprice + cost2!.fare * chairsQTY + Diffrence;
		} else {
			totalprice = totalprice + cost2!.fare * chairsQTY;
		}

		let finalprice = totalprice;

		const actualdiscount =
			(cost1?.twowaydiscount || 0) < (cost2?.twowaydiscount || 0)
				? cost1?.twowaydiscount
				: cost2?.twowaydiscount;

		if ((actualdiscount ?? 0) > 0) {
			finalprice = (totalprice * (100 - (actualdiscount ?? 0))) / 100;
		}

		//check if it's cash
		if (action == "cash") {
			const payid = Date.now() * 1000 + Math.floor(Math.random() * 1000);
			const paymentData = {
				trip_type: "double",
				trip_id1: trip_id1,
				trip_id2: trip_id2,
				date1: formattedDate1,
				date2: formattedDate2,
				name: name,
				phone: phone,
				station_from1: station_from1,
				station_from2: station_from2,
				station_to1: station_to1,
				station_to2: station_to2,
				city_to1: city_to1,
				city_to2: city_to2,
				city_from1: city_from1,
				city_from2: city_from2,
				chairs1: ReservedChairs1,
				chairs2: ReservedChairs2,
				chairsQTY: chairsQTY,
				paymentmethod: action,
				take_off1: take_off1,
				take_off2: take_off2,
				arrive1: arrive1,
				arrive2: arrive2,
				oldprice: totalprice,
				discount: actualdiscount,
				price: finalprice,
				payid: payid,
			};

			await DoubleCashpayment(paymentData);
			return res.redirect(`/ticket?id=${payid}`);
		}

		let integrationID;
		if (action == "visa") {
			integrationID = 4927399;
		} else if (action == "VFcash") {
			integrationID = 4927400;
		}

		const data = {
			amount: finalprice * 100,
			currency: "EGP",
			payment_methods: [integrationID],
			items: [
				{
					name: "Bus Reservation",
					amount: finalprice * 100,
					description: "Reservation for bus ride inside egypt",
					quantity: 1,
				},
			],
			billing_data: {
				apartment: "dumy",
				first_name: name,
				last_name: "none",
				street: "dumy",
				building: "dumy",
				phone_number: "01100725449",
				city: "dumy",
				country: "dumy",
				email: "dahabawybus@gmail.com",
				floor: "dumy",
				state: "dumy",
			},
			extras: {
				details: {
					trip_type: "double",
					trip_id1: trip_id1,
					trip_id2: trip_id2,
					date1: formattedDate1,
					date2: formattedDate2,
					name: name,
					phone: phone,
					station_from1: station_from1,
					station_from2: station_from2,
					station_to1: station_to1,
					station_to2: station_to2,
					city_to1: city_to1,
					city_to2: city_to2,
					city_from1: city_from1,
					city_from2: city_from2,
					chairs1: ReservedChairs1,
					chairs2: ReservedChairs2,
					chairsQTY: chairsQTY,
					paymentmethod: action,
					take_off1: take_off1,
					take_off2: take_off2,
					arrive1: arrive1,
					arrive2: arrive2,
					discount: actualdiscount,
					price: finalprice,
					oldprice: totalprice,
				},
			},
		};

		const headers = {
			Authorization: `Bearer ${process.env.SECRET_KEY}`,
			"Content-Type": "application/json",
		};

		if (OldtempReservations1) {
			const updatedReservedSeats = OldtempReservations1.reservedSeats as
				| number[]
				| null;

			updatedReservedSeats!.push(...ReservedChairs1);

			await prisma.tempReservation.update({
				where: { id: OldtempReservations1.id },
				data: {
					reservedSeats_counter:
						OldtempReservations1.reservedSeats_counter + ReservedChairs1.length,
					reservedSeats: updatedReservedSeats || [],
				},
			});
		} else {
			const TempReserve = await prisma.tempReservation.create({
				data: {
					trip_id: trip_id1,
					trip_date: formattedDate1,
					reservedSeats_counter: +chairsQTY,
					reservedSeats: ReservedChairs1,
				},
			});
		}

		if (OldtempReservations2) {
			const updatedReservedSeats = OldtempReservations2.reservedSeats as
				| number[]
				| null;

			updatedReservedSeats!.push(...ReservedChairs2);

			await prisma.tempReservation.update({
				where: { id: OldtempReservations2.id },
				data: {
					reservedSeats_counter:
						OldtempReservations2.reservedSeats_counter + ReservedChairs2.length,
					reservedSeats: updatedReservedSeats || [],
				},
			});
		} else {
			const TempReserve = await prisma.tempReservation.create({
				data: {
					trip_id: trip_id2,
					trip_date: formattedDate2,
					reservedSeats_counter: +chairsQTY,
					reservedSeats: ReservedChairs2,
				},
			});
		}

		// const newfingerprint = await prisma.fingerprint.create({data : {
		// 	fingerprint : req.fingerprint?.hash || "Null"
		// }});

		axios
			.post("https://accept.paymob.com/v1/intention/", data, { headers })
			.then((response) => {
				const SECRET_CLIENT = response.data.client_secret;
				res.redirect(
					`https://accept.paymob.com/unifiedcheckout/?publicKey=${pk_key}&clientSecret=${SECRET_CLIENT}`
				);
			})
			.catch((error) => {
				console.error(
					"Paymob API Error:",
					error.response?.data || error.message
				);
				res.status(400).json({
					error: "Payment request failed",
					details: error.response?.data,
				});
			});
	} catch (error) {
		next(error);
	}
};
