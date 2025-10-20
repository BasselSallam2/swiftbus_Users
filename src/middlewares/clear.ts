import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js"
let lastCleanupTime = 0;

const cleanup = async () => {
  console.log('we are here') ;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (now - lastCleanupTime > fiveMinutes) {
    lastCleanupTime = now;

    try {
      const Temp = prisma.tempReservation.findFirst() ;
      if(!Temp) {
        return ;
      }

      const fiveMinutesAgo = new Date(now - fiveMinutes);
      const deleted = await prisma.tempReservation.deleteMany({
        where: {
          CreatedAt: { lt: fiveMinutesAgo },
        },
      });

      if (deleted.count > 0) {
        console.log(`Deleted ${deleted.count} expired temp reservations.`);
      }
    } catch (err) {
      console.error("Cleanup error", err);
    }
  }


};


export default cleanup ;