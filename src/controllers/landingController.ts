import prisma from "../lib/prisma.js"
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";

export const Getlanding = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
         
        const Markting = await prisma.marktingLines.findMany({
            select: { Arabiccity: true, Arabicsubtitle: true, image_path: true },
        });
        const citywithstations = await prisma.city.findMany({
            where: { isDeleted: false },
            select: {
            Arabicname: true,
            stations: {
                where: { isDeleted: false },
                select: {
                Arabicname: true,
                name: true,
                },
            },
            },
        });
        const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
        const footerinfo = await prisma.info.findFirst();
        const arabicfreqquestion = await prisma.freqQuestionsArabic.findFirst({
            select: { Questions: { select: { question: true, answer: true } } },
        });

        res.render("landing", {
            Markting,
            ArabicFrontpage,
            citywithstations,
            arabicfreqquestion,
            footerinfo,
        });
    } catch (error) {
        next(error);
    }
};

export const GetlandingEn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const Markting = await prisma.marktingLines.findMany({
            select: { Englishcity: true, Englishsubtitle: true, image_path: true },
        });
        const citywithstations = await prisma.city.findMany({
            where: { isDeleted: false },
            select: {
                name: true,
                stations: {where:{isDeleted:false},
                    select: {
                        name: true,
                    },
                },
            },
        });
        const EnglishFrontpage = await prisma.frontpageEnglish.findFirst();
        const footerinfo = await prisma.info.findFirst();
        const Englishfreqquestion = await prisma.freqQuestionsEnglish.findFirst({
            select: { Questions: { select: { question: true, answer: true } } },
        });

        res.render("landingEN", {
            Markting,
            EnglishFrontpage,
            citywithstations,
            Englishfreqquestion,
            footerinfo,
        });
    } catch (error) {
        next(error);
    }
};


