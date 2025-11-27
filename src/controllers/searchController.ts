import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";
import pkg from "rrule";
const { RRule } = pkg;

import prisma from "../lib/prisma.js"

import { searchService } from "../utils/services/searchService.js";
import { searchMapper } from "../utils/mappers/searchmapper.js";
import { date, string } from "zod";

function getPreviousDay(dateString: string): string {
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    const prevYear = date.getFullYear();
    const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
    const prevDay = String(date.getDate()).padStart(2, '0');
    return `${prevMonth}/${prevDay}/${prevYear}`;
}

function getDayNames(dateString: string): { day: string, Arabicday: string } {
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const arabicDayName = date.toLocaleDateString('ar-EG', { weekday: 'long' });
    return { day: dayName, Arabicday: arabicDayName };
}


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

let GoResult = await searchMapper(
    searchresultGo,
    first_choice as string,
    second_choice as string,
    travel_date as string,
    qty as string
);

// تصفية الرحلات الصباحية المبكرة
const earlyMorningTrips = GoResult.filter(trip => {
    const time = trip.details.fromarrivaleTime;
    const isEarly = /^(12|01|02|03|04):[0-5][0-9]\s?AM$|^(05):00\s?AM$/.test(time);
    if (isEarly) {
        if (time === '12:00 AM') return false; 
        return true;
    }
    return false;
});

const finalGoResult = GoResult.filter(trip => !earlyMorningTrips.includes(trip));
const tripIdsToRerun = earlyMorningTrips.map(trip => trip.id);

const previousDate = getPreviousDay(travel_date as string);
const trueDays = getDayNames(travel_date as string);

console.log(`Searching on previous date: ${previousDate}`); 

if (tripIdsToRerun.length > 0) {
    const searchResultPreviousDay = await searchService(
        previousDate, 
        first_choice as string,
        second_choice as string,
        qty as string
    );

    let previousDayResult = await searchMapper(
        searchResultPreviousDay,
        first_choice as string,
        second_choice as string,
        previousDate, 
        qty as string
    );

    const relocatedTrips = previousDayResult.filter(trip => 
        tripIdsToRerun.includes(trip.id)
    );
    
    // 💡 التعديل الهام: تحديث حقول التاريخ واليوم
    const updatedRelocatedTrips = relocatedTrips.map(trip => ({
        ...trip, 
        edit:"EDIT_DATE",
		date: travel_date,
		Arabicday: trueDays.Arabicday,
		day: trueDays.day
    }));
    
    // استخدام المصفوفة المحدثة هنا
    finalGoResult.push(...updatedRelocatedTrips); 

    // console.log("========== Final GoResult after relocation ==========");
    // console.log(finalGoResult);
} else {
    console.log("No early morning trips found to relocate to the previous day.");
}

// =======================================================
// منطق معالجة رحلات العودة (BackResult) - تطبيق نفس المنطق
// =======================================================

let BackResult = [];

if (radio === "twoWay" && !back_date) {
    return res.redirect('/') ;
}

if (radio === "twoWay" && back_date) {
    // 1. البحث الأولي عن رحلات العودة
    const searchresultBack = await searchService(
        back_date as string,
        second_choice as string,
        first_choice as string,
        qty as string
    );

    // 2. رسم خرائط نتائج العودة
    BackResult = await searchMapper(
        searchresultBack,
        second_choice as string,
        first_choice as string,
        back_date as string,
        qty as string
    );
    
    // 3. تطبيق منطق الترحيل على BackResult
    
    // أ. تحديد الرحلات الصباحية المبكرة
    const earlyMorningBackTrips = BackResult.filter(trip => {
        const time = trip.details.fromarrivaleTime;
        const isEarly = /^(12|01|02|03|04):[0-5][0-9]\s?AM$|^(05):00\s?AM$/.test(time);
    
        if (isEarly) {
            if (time === '12:00 AM') return false; 
            return true;
        }
        return false;
    });

    // ب. إزالة الرحلات المبكرة من BackResult الأصلية
    const finalBackResult = BackResult.filter(trip => !earlyMorningBackTrips.includes(trip));
    const backTripIdsToRerun = earlyMorningBackTrips.map(trip => trip.id);

    // ج. حساب التاريخ واليوم السابق لرحلة العودة
    const backPreviousDate = getPreviousDay(back_date as string);
    const backTrueDays = getDayNames(back_date as string); // أسماء الأيام لتاريخ العودة الأصلي

    if (backTripIdsToRerun.length > 0) {
        
        // إعادة البحث لليوم السابق للعودة
        const searchResultBackPreviousDay = await searchService(
            backPreviousDate, 
            second_choice as string, 
            first_choice as string,
            qty as string
        );

        let previousDayBackResult = await searchMapper(
            searchResultBackPreviousDay,
            second_choice as string,
            first_choice as string,
            backPreviousDate, 
            qty as string
        );

        // تصفية نتائج اليوم السابق للرحلات التي تم ترحيلها
        const relocatedBackTrips = previousDayBackResult.filter(trip => 
            backTripIdsToRerun.includes(trip.id)
        );

        // 💡 التعديل الهام: تحديث حقول التاريخ واليوم
        const updatedRelocatedBackTrips = relocatedBackTrips.map(trip => ({
            ...trip, 
            date: back_date as string,     
            day: backTrueDays.day,           
            Arabicday: backTrueDays.Arabicday,
			edit:"EDIT_DATE"
        }));

        // دمج النتائج المحدثة في المصفوفة النهائية
        finalBackResult.push(...updatedRelocatedBackTrips);
    }
    
    // تحديث BackResult إلى المصفوفة النهائية المعالجة
    BackResult = finalBackResult;
}   

// 4. استدعاء قاعدة البيانات والمعالجة النهائية
const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
const footerinfo = await prisma.info.findFirst();


if(radio === "oneWay") {
    // نستخدم finalGoResult (المعالجة)
    return res.render("trips" , {GoResult: finalGoResult , radio , qty , ArabicFrontpage , footerinfo}) ;
}

// نستخدم finalGoResult و BackResult (المعالجة)
return res.render("trips" , {GoResult: finalGoResult , BackResult , radio , qty , ArabicFrontpage , footerinfo}) ;
		
	
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
		
	// تصفية الرحلات الصباحية المبكرة
const earlyMorningTrips = GoResult.filter(trip => {
    const time = trip.details.fromarrivaleTime;
    const isEarly = /^(12|01|02|03|04):[0-5][0-9]\s?AM$|^(05):00\s?AM$/.test(time);
    if (isEarly) {
        if (time === '12:00 AM') return false; 
        return true;
    }
    return false;
});

const finalGoResult = GoResult.filter(trip => !earlyMorningTrips.includes(trip));
const tripIdsToRerun = earlyMorningTrips.map(trip => trip.id);

const previousDate = getPreviousDay(travel_date as string);
const trueDays = getDayNames(travel_date as string);

console.log(`Searching on previous date: ${previousDate}`); 

if (tripIdsToRerun.length > 0) {
    const searchResultPreviousDay = await searchService(
        previousDate, 
        first_choice as string,
        second_choice as string,
        qty as string
    );

    let previousDayResult = await searchMapper(
        searchResultPreviousDay,
        first_choice as string,
        second_choice as string,
        previousDate, 
        qty as string
    );

    const relocatedTrips = previousDayResult.filter(trip => 
        tripIdsToRerun.includes(trip.id)
    );
    
    // 💡 التعديل الهام: تحديث حقول التاريخ واليوم
    const updatedRelocatedTrips = relocatedTrips.map(trip => ({
        ...trip, 
        edit:"EDIT_DATE",
		date: travel_date,
		Arabicday: trueDays.Arabicday,
		day: trueDays.day
    }));
    
    // استخدام المصفوفة المحدثة هنا
    finalGoResult.push(...updatedRelocatedTrips); 

    // console.log("========== Final GoResult after relocation ==========");
    // console.log(finalGoResult);
} else {
    console.log("No early morning trips found to relocate to the previous day.");
}

// =======================================================
// منطق معالجة رحلات العودة (BackResult) - تطبيق نفس المنطق
// =======================================================

let BackResult = [];

if (radio === "twoWay" && !back_date) {
    return res.redirect('/') ;
}

if (radio === "twoWay" && back_date) {
    // 1. البحث الأولي عن رحلات العودة
    const searchresultBack = await searchService(
        back_date as string,
        second_choice as string,
        first_choice as string,
        qty as string
    );

    // 2. رسم خرائط نتائج العودة
    BackResult = await searchMapper(
        searchresultBack,
        second_choice as string,
        first_choice as string,
        back_date as string,
        qty as string
    );

	
    
    // 3. تطبيق منطق الترحيل على BackResult
    
    // أ. تحديد الرحلات الصباحية المبكرة
    const earlyMorningBackTrips = BackResult.filter(trip => {
        const time = trip.details.fromarrivaleTime;
        const isEarly = /^(12|01|02|03|04):[0-5][0-9]\s?AM$|^(05):00\s?AM$/.test(time);
    
        if (isEarly) {
            if (time === '12:00 AM') return false; 
            return true;
        }
        return false;
    });

    // ب. إزالة الرحلات المبكرة من BackResult الأصلية
    const finalBackResult = BackResult.filter(trip => !earlyMorningBackTrips.includes(trip));
    const backTripIdsToRerun = earlyMorningBackTrips.map(trip => trip.id);

    // ج. حساب التاريخ واليوم السابق لرحلة العودة
    const backPreviousDate = getPreviousDay(back_date as string);
    const backTrueDays = getDayNames(back_date as string); // أسماء الأيام لتاريخ العودة الأصلي

    if (backTripIdsToRerun.length > 0) {
        
        // إعادة البحث لليوم السابق للعودة
        const searchResultBackPreviousDay = await searchService(
            backPreviousDate, 
            second_choice as string, 
            first_choice as string,
            qty as string
        );

        let previousDayBackResult = await searchMapper(
            searchResultBackPreviousDay,
            second_choice as string,
            first_choice as string,
            backPreviousDate, 
            qty as string
        );

        // تصفية نتائج اليوم السابق للرحلات التي تم ترحيلها
        const relocatedBackTrips = previousDayBackResult.filter(trip => 
            backTripIdsToRerun.includes(trip.id)
        );

        // 💡 التعديل الهام: تحديث حقول التاريخ واليوم
        const updatedRelocatedBackTrips = relocatedBackTrips.map(trip => ({
            ...trip, 
            date: back_date as string,     
            day: backTrueDays.day,           
            Arabicday: backTrueDays.Arabicday,
			edit:"EDIT_DATE"
        }));

        // دمج النتائج المحدثة في المصفوفة النهائية
        finalBackResult.push(...updatedRelocatedBackTrips);
    }
    
    // تحديث BackResult إلى المصفوفة النهائية المعالجة
    BackResult = finalBackResult;
}   
		const EnglishFrontpage = await prisma.frontpageEnglish.findFirst();
		const footerinfo = await prisma.info.findFirst();
		
		if(radio === "oneWay") {
			return res.render("tripsEN" , {GoResult: finalGoResult , radio , qty , EnglishFrontpage , footerinfo}) ;
		}

		return res.render("tripsEN" , {GoResult: finalGoResult , BackResult , radio , qty , EnglishFrontpage , footerinfo}) ;
		
		
	
	} catch (error) {
		console.error(error);
	}
};
