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


export const Arabicterms = async (req:Request , res:Response , next:NextFunction) => {
   const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
   res.render("terms" , {ArabicFrontpage}) ;
}

export const Englishterms = async (req:Request , res:Response , next:NextFunction) => {
    const EnglishFrontpage = await prisma.frontpageEnglish.findFirst();
    res.render("termsEN" , {EnglishFrontpage} ) ;
   
}

export const ArabicPolicy = async (req:Request , res:Response , next:NextFunction) => {
    const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
    res.render("policy" , {ArabicFrontpage}) ;
}

export const EnglishPolicy = async (req:Request , res:Response , next:NextFunction) => {
    const EnglishFrontpage = await prisma.frontpageEnglish.findFirst();
    res.render("policyEN" , {EnglishFrontpage}) ;
}

