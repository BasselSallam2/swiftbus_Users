import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";
import pkg from "rrule";
const { RRule } = pkg;

import prisma from "../lib/prisma.js"

import { searchService } from "../utils/services/searchService.js";
import { searchMapper } from "../utils/mappers/searchmapper.js";
import { string } from "zod";
import { json } from "stream/consumers";

import cleanup from "../middlewares/clear.js";



export const SelectSingleTrip = async (req:Request , res:Response , next:NextFunction) => {
    try {

    //const { trip_id, trip_date, bus_type, trip_day, trip_takeoff, trip_from, trip_to, trip_fare, trip_specialfare , city_from, city_to, payment , chairsNumber , trip_arrive } = req.body;
    const Data = req.body ;
    
   
   await cleanup();

    const [month, day, year] = Data.trip_date.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

    const paymentMethods = Data.payment.split(',');


    const Reservations = await prisma.reservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id}});
    const tempReservation = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id}});
    const vouchers = await prisma.voucher.findMany({ where: { consumed: { lt: prisma.voucher.fields.avaliable } , isActive: true }});
    const footerinfo = await prisma.info.findFirst();
    const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
   
        res.render("signlechair" , {Data , Reservations , vouchers , paymentMethods , tempReservation , footerinfo , ArabicFrontpage} ) ;
    }
    catch(error){
        console.log(error) ;
        res.redirect('/') ;
    }
}




export const SelectSingleTripEN = async (req:Request , res:Response , next:NextFunction) => {
    try {

    //const { trip_id, trip_date, bus_type, trip_day, trip_takeoff, trip_from, trip_to, trip_fare, trip_specialfare , city_from, city_to, payment , chairsNumber , trip_arrive } = req.body;
    const Data = req.body ;
    
   await cleanup();
   

    const [month, day, year] = Data.trip_date.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

    const paymentMethods = Data.payment.split(',');


    const Reservations = await prisma.reservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id}});
    const tempReservation = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id}});
    const vouchers = await prisma.voucher.findMany({ where: { consumed: { lt: prisma.voucher.fields.avaliable } , isActive: true }});
    const instructions = await prisma.englishInstructions.findMany() ;
    const EnglishFrontpage = await prisma.frontpageEnglish.findFirst() ;
    const footerinfo = await prisma.info.findFirst() ;

   
        res.render("signlechairEN" , {Data , Reservations , vouchers , paymentMethods , tempReservation , instructions , EnglishFrontpage , footerinfo} ) ;
    }
    catch(error){
        console.log(error) ;
        res.redirect('/') ;
    }
}




export const SelectdoubleTrip = async (req:Request , res:Response , next:NextFunction) => {
    try {

    //const { trip_id, trip_date, bus_type, trip_day, trip_takeoff, trip_from, trip_to, trip_fare, trip_specialfare , city_from, city_to, payment , chairsNumber , trip_arrive , twowaydiscount } = req.body;
    const Data = req.body ;
 
    await cleanup();
  
   
   

    const [month, day, year] = Data.trip_date1.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

    const [month2, day2, year2] = Data.trip_date2.split('/');
    const formattedDate2 = new Date(`${year2}-${month2}-${day2}`).toISOString().split('T')[0];

    const paymentMethods = Data.payment1.split(',');


    const Reservations = await prisma.reservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id1}});
    const Reservations2 = await prisma.reservation.findFirst({where : {trip_date : formattedDate2 , trip_id : Data.trip_id2}});
    const tempReservation = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id1}});
    const tempReservation2 = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate2 , trip_id : Data.trip_id2}});
    const vouchers = await prisma.voucher.findMany({ where: { consumed: { lt: prisma.voucher.fields.avaliable } , isActive: true }});
    const ArabicFrontpage = await prisma.frontpageArabic.findFirst() ;
    const footerinfo = await prisma.info.findFirst() ;
   
        res.render("doublechair" , {Data , Reservations , Reservations2, vouchers , paymentMethods , tempReservation , tempReservation2 , ArabicFrontpage , footerinfo} ) ;
    }
    catch(error){
        console.log(error) ;
        res.redirect('/') ;
    }
}





export const SelectdoubleTripEN = async (req:Request , res:Response , next:NextFunction) => {
    try {

    //const { trip_id, trip_date, bus_type, trip_day, trip_takeoff, trip_from, trip_to, trip_fare, trip_specialfare , city_from, city_to, payment , chairsNumber , trip_arrive , twowaydiscount } = req.body;
    const Data = req.body ;

    await cleanup();
 
    const [month, day, year] = Data.trip_date1.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

    const [month2, day2, year2] = Data.trip_date2.split('/');
    const formattedDate2 = new Date(`${year2}-${month2}-${day2}`).toISOString().split('T')[0];

    const paymentMethods = Data.payment1.split(',');


    const Reservations = await prisma.reservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id1}});
    const Reservations2 = await prisma.reservation.findFirst({where : {trip_date : formattedDate2 , trip_id : Data.trip_id2}});
    const tempReservation = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id1}});
    const tempReservation2 = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate2 , trip_id : Data.trip_id2}});
    const vouchers = await prisma.voucher.findMany({ where: { consumed: { lt: prisma.voucher.fields.avaliable } , isActive: true }});
    const EnglishFrontpage = await prisma.frontpageEnglish.findFirst() ;
    const footerinfo = await prisma.info.findFirst() ;
    const instructions = await prisma.englishInstructions.findMany();
   
        res.render("doublechairEN" , {Data , Reservations , Reservations2, vouchers , paymentMethods , tempReservation , tempReservation2 , EnglishFrontpage ,  footerinfo , instructions} ) ;
    }
    catch(error){
        console.log(error) ;
        res.redirect('/') ;
    }
}