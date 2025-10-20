import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {singleticket , doubleticket} from "../utils/services/ticketService.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const showTicket = async (req:Request , res:Response , next:NextFunction) => {
    const {id} = req.query ;
    let ticket;
    let trip;
    let trip2;
    let takeoffstation ;
    let takeoffstation2 ;
    let arrivestation ;
    let arrivestation2 ;
    const footerinfo = await prisma.info.findFirst() ;
    const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
    if(id) {
         ticket = await prisma.ticket.findUnique({where:{pay_id : +id} , include : {CoustmerID:true}}) ;
         if(!ticket) {
            return res.redirect("/") ;
         }
          trip = await prisma.trip.findUnique({where:{id : ticket?.trip_id},include:{Bus: true }}) ;
          trip2 = await prisma.trip.findUnique({where:{id : ticket?.Back_trip_id || '12457f02-a818-4cdb-b3be-21ghytr5432d'},include:{Bus: true }}) ;
          const stationRoutesArray = ticket?.StationRoutes as string[] ?? [];
          const stationRoutesArray2 = ticket?.Back_StationRoutes as string[] ?? [];

          if (stationRoutesArray.length > 0) {
            takeoffstation = await prisma.station.findUnique({
                  where: { name: stationRoutesArray[0] } , include : {city : true}
              });

              arrivestation = await prisma.station.findUnique({
                where: { name: stationRoutesArray[1] } , include : {city : true}
            });
          } 

          if(ticket?.Back_trip_id) {
            if (stationRoutesArray2.length > 0) {
                takeoffstation2 = await prisma.station.findUnique({
                      where: { name: stationRoutesArray2[0] } , include : {city : true}
                  });
    
                  arrivestation2 = await prisma.station.findUnique({
                    where: { name: stationRoutesArray2[1] } , include : {city : true}
                });
              } 
          }
         
       
    }

   
    if(ticket?.Back_trip_id){
       return  res.render("ticket" , {ticket , trip, trip2, footerinfo , takeoffstation ,takeoffstation2 , arrivestation , arrivestation2 , ArabicFrontpage }) ;
       
    }

    

        res.render("ticket" , {ticket , trip, footerinfo , takeoffstation , arrivestation  , ArabicFrontpage}) ;
    
}





export const showTicketEN = async (req:Request , res:Response , next:NextFunction) => {
    const {id} = req.query ;
    let ticket;
    let trip;
    let trip2;
    let takeoffstation ;
    let takeoffstation2 ;
    let arrivestation ;
    let arrivestation2 ;
    const footerinfo = await prisma.info.findFirst() ;
    const EnglishFrontpage = await prisma.frontpageEnglish.findFirst();
    if(id) {
         ticket = await prisma.ticket.findUnique({where:{pay_id : +id} , include : {CoustmerID:true}}) ;
         if(!ticket) {
            return res.redirect("/") ;
         }
          trip = await prisma.trip.findUnique({where:{id : ticket?.trip_id},include:{Bus: true }}) ;
          trip2 = await prisma.trip.findUnique({where:{id : ticket?.Back_trip_id || '12457f02-a818-4cdb-b3be-21ghytr5432d'},include:{Bus: true }}) ;
          const stationRoutesArray = ticket?.StationRoutes as string[] ?? [];
          const stationRoutesArray2 = ticket?.Back_StationRoutes as string[] ?? [];

          if (stationRoutesArray.length > 0) {
            takeoffstation = await prisma.station.findUnique({
                  where: { name: stationRoutesArray[0] }
              });

              arrivestation = await prisma.station.findUnique({
                where: { name: stationRoutesArray[1] }
            });
          } 

          if(ticket?.Back_trip_id) {
            if (stationRoutesArray2.length > 0) {
                takeoffstation2 = await prisma.station.findUnique({
                      where: { name: stationRoutesArray2[0] }
                  });
    
                  arrivestation2 = await prisma.station.findUnique({
                    where: { name: stationRoutesArray2[1] }
                });
              } 
          }
         
       
    }
   
    if(ticket?.Back_trip_id){
       return  res.render("ticketEN" , {ticket , trip, trip2, footerinfo , takeoffstation ,takeoffstation2 , arrivestation , arrivestation2 , EnglishFrontpage }) ;
       
    }

        res.render("ticketEN" , {ticket , trip, footerinfo , takeoffstation , arrivestation  , EnglishFrontpage}) ;
    
}


export const DownloadTicket = async (req:Request , res:Response , next:NextFunction) => {
    const doc = new PDFDocument({ margin: 50 });

    try {
      

      const ticket = await prisma.ticket.findUnique({where : {id : req.params.id} , include : {CoustmerID : true , voucher:true}}) ;

      const trip_id = ticket?.trip_id ;

        if(!ticket?.Back_trip_id) {
            singleticket(ticket , trip_id , res) ;
        }else{
            doubleticket(ticket , trip_id , res) ;
        }
     
 

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
};


