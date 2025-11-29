import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";
import pkg from "rrule";
const { RRule } = pkg;

import prisma from "../lib/prisma.js"

import { searchService } from "../utils/services/searchService.js";
import { searchMapper } from "../utils/mappers/searchmapper.js";
import { string } from "zod";



export const Searchresult = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { travel_date , back_date , radio , first_choice, second_choice , qty } = req.body;
		//console.log(travel_date , back_date , radio , first_choice , second_choice , qty);
		
		

		if (!travel_date || !first_choice || !second_choice || !qty) {
			return res.redirect('/') ;
		}

		if (travel_date && back_date && radio == 'twoWay') {
			const DATEGO = new Date(travel_date as string);
			const DATEBACK = new Date(back_date as string);
			if (travel_date > back_date) {
				return res.redirect('/') ;
			}
		}

		const searchresultGo = await searchService(
			travel_date as string,
			first_choice as string,
			second_choice as string,
			qty as string
		);


		const GoResult = await searchMapper(
			searchresultGo,
			first_choice as string,
			second_choice as string,
			travel_date as string,
			qty as string
		);
		
	


	

		let BackResult = [];

		if (radio === "twoWay" && !back_date) {
			return res.redirect('/') ;
		}

		if (radio === "twoWay" && back_date) {
			const searchresultBack = await searchService(
				back_date as string,
				second_choice as string,
				first_choice as string,
				qty as string
			);

			if (radio === "twoWay" && back_date) {	
			BackResult = await searchMapper(
				searchresultBack,
				second_choice as string,
				first_choice as string,
				back_date as string,
				qty as string
			);
		 }
		}	

		const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
		const footerinfo = await prisma.info.findFirst();
	
		
		if(radio === "oneWay") {
			return res.render("trips" , {GoResult , radio , qty , ArabicFrontpage , footerinfo}) ;
		}

		return res.render("trips" , {GoResult , BackResult , radio , qty , ArabicFrontpage , footerinfo}) ;
		
		
	
	} catch (error) {
		console.error(error);
	}
};



export const SearchresultEN = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { travel_date , back_date , radio , first_choice, second_choice , qty } = req.body;
		//console.log(travel_date , back_date , radio , first_choice , second_choice , qty);
	
		

		if (!travel_date || !first_choice || !second_choice || !qty) {
			return res.redirect('/') ;
		}

		if (travel_date && back_date && radio == 'twoWay') {
			const DATEGO = new Date(travel_date as string);
			const DATEBACK = new Date(back_date as string);
			if (travel_date > back_date) {
				return res.redirect('/') ;
			}
		}

		const searchresultGo = await searchService(
			travel_date as string,
			first_choice as string,
			second_choice as string,
			qty as string
		);


		const GoResult = await searchMapper(
			searchresultGo,
			first_choice as string,
			second_choice as string,
			travel_date as string,
			qty as string
		);
		
	


	

		let BackResult = [];

		if (radio === "twoWay" && !back_date) {
			return res.redirect('/') ;
		}

		if (radio === "twoWay" && back_date) {
			const searchresultBack = await searchService(
				back_date as string,
				second_choice as string,
				first_choice as string,
				qty as string
			);

			if (radio === "twoWay" && back_date) {	
			BackResult = await searchMapper(
				searchresultBack,
				second_choice as string,
				first_choice as string,
				back_date as string,
				qty as string
			);
		 }
		}	

		const EnglishFrontpage = await prisma.frontpageEnglish.findFirst();
		const footerinfo = await prisma.info.findFirst();
		
		if(radio === "oneWay") {
			return res.render("tripsEN" , {GoResult , radio , qty , EnglishFrontpage , footerinfo}) ;
		}

		return res.render("tripsEN" , {GoResult , BackResult , radio , qty , EnglishFrontpage , footerinfo}) ;
		
		
	
	} catch (error) {
		console.error(error);
	}
};
