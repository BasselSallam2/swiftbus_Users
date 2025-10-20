import { Request, Response, NextFunction } from "express";
import {successResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/CustomError.js";

import prisma from "../lib/prisma.js"


export const CreateTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
    } catch (error) {
        next(error);
    }
}