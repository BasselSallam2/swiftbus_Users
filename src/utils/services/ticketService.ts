
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from "express";
import getStream from "get-stream";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const singleticket = async (ticket: any, trip_id: any, res: Response) => {
    try {
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });

        // ✅ Load Arabic font
        const arabicFont = path.join(process.cwd(), "src/public/assets/fonts/Cairo-Regular.ttf");
        doc.font(arabicFont);

        const logo = path.join(process.cwd(), "src/public/assets/images/colorlogo.jpg");

        const reverseArabicText = (text: string) => {
            return text.split(' ').reverse().join(' ');
        };

        // Create a buffer to store the PDF
        const chunks: Uint8Array[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
            // Combine the chunks into a single buffer
            const pdfBuffer = Buffer.concat(chunks);

            // Send the PDF as a response
            res.setHeader("Content-Disposition", `attachment; filename="ticket_${trip_id}.pdf"`);
            res.setHeader("Content-Type", "application/pdf");
            res.send(pdfBuffer);
        });

        // Title
        doc.fontSize(20).fillColor("green").text(reverseArabicText("تم  حجز رحلتك بنجاح وهذه هي تذكرتك"), { align: "center" });
        doc.fontSize(20).fillColor("black").text(reverseArabicText(`بتاريخ: ${ticket?.trip_date} `), { align: "center" }).moveDown();

        doc.image(logo, { fit: [400, 400] });

        // Passenger Info
        doc.fontSize(14).fillColor("black").text(reverseArabicText(`رقم  التذكرة المحجوزة : ${ticket?.ticket_code}`), { align: "right" });
        doc.text(reverseArabicText(`  باسم: ${ticket?.CoustmerID.name}`), { align: "right" });
        doc.text(reverseArabicText(`رقم  موبايل : ${ticket?.CoustmerID.phone}`), { align: "right" });

        if (ticket?.paymentMethod === 'cash') {
            doc.fillColor("red").text(reverseArabicText(`  برجاء دفع المبلغ المستحق قبل الرحلة `), { align: "right" });
        }

        doc.moveDown();

        // Price and Passenger Details
        doc.fontSize(16).fillColor("black").text(reverseArabicText(`عدد المسافرين: ${ticket?.seatsCounter}`), { align: "right" }).moveDown();
        doc.text(reverseArabicText(`رقم الكراسي: ${ticket?.seats}`), { align: "right" }).moveDown();
        doc.fontSize(16).fillColor("black").text(reverseArabicText(`الإجمالي: EGP ${ticket?.price}`), { align: "right" });

        doc.moveDown();

        // Travel Info
        if (ticket?.StationRoutes && Array.isArray(ticket.StationRoutes)) {
            doc.text(reverseArabicText(`التحرك من: ${ticket.StationRoutes[0]} - ${ticket.takeoff}`), { align: "right" });
        }
        if (ticket?.StationRoutes && ticket.StationRoutes.length > 1) {
            doc.text(reverseArabicText(`الوصول إلى: ${ticket.StationRoutes[1]} - ${ticket.arrive}`), { align: "right" });
        }
        doc.moveDown();

        // Payment Info
        doc.fontSize(14).fillColor("black").text(reverseArabicText(`تم الدفع عن طريق: ${ticket?.paymentMethod}`), { align: "right" });
        if (ticket?.voucher) {
            doc.text(reverseArabicText(`  باستخدام كود شراء: ${ticket?.voucher?.code}`), { align: "right" });
        }

        doc.moveDown();
        doc.fontSize(40).fillColor("green").text(reverseArabicText("نتمني  لكم رحلة آمنه و سعيدة"), { align: "center" }).moveDown();

        // **Finalize the PDF**
        doc.end();
    } catch (err) {
        console.error("Error generating PDF:", err);
        res.status(500).json({ error: err });
    }
};

export const doubleticket = async (ticket: any, trip_id: any, res: Response) => {
    try {
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });

        // ✅ Use an Arabic font
        const arabicFont = path.join(__dirname, "../../public/assets/fonts/Cairo-Regular.ttf");
        doc.font(arabicFont);

        const logo = path.join(__dirname, "../../public/assets/images/colorlogo.jpg");

        const reverseArabicText = (text: string) => {
            return text.split(' ').reverse().join(' ');
        };

        // Set headers for direct download
        res.setHeader("Content-Disposition", `attachment; filename="ticket_${trip_id}.pdf"`);
        res.setHeader("Content-Type", "application/pdf");

        // Pipe PDF directly to response (No file writing)
        doc.pipe(res);

        // Title
        doc.fontSize(20).fillColor("green").text(reverseArabicText("تم  حجز رحلتك بنجاح وهذه هي تذكرتك"), { align: "center" });
        doc.fontSize(20).fillColor("black").text(reverseArabicText(`ذهاب  و عودة `), { align: "center" });
        doc.fontSize(20).fillColor("black").text(reverseArabicText(`بتاريخ ذهاب: ${ticket?.trip_date} `), { align: "center" });
        doc.fontSize(20).fillColor("black").text(reverseArabicText(`بتاريخ عودة: ${ticket?.Back_trip_date} `), { align: "center" }).moveDown();

        doc.image(logo, { fit: [400, 400] });

        // Passenger Info
        doc.fontSize(14).fillColor("black").text(reverseArabicText(`رقم  التذكرة المحجوزة : ${ticket?.ticket_code}`), { align: "right" });
        doc.text(reverseArabicText(`  باسم: ${ticket?.CoustmerID.name}`), { align: "right" });
        doc.text(reverseArabicText(`رقم  موبايل : ${ticket?.CoustmerID.phone}`), { align: "right" });

        if (ticket?.paymentMethod === 'cash') {
            doc.fillColor("red").text(reverseArabicText(`  برجاء دفع المبلغ المستحق قبل الرحلة `), { align: "right" });
        }

        doc.moveDown();

        // Price and Passenger Details
        doc.fontSize(16).fillColor("black").text(reverseArabicText(`عدد المسافرين: ${ticket?.seatsCounter}`), { align: "right" }).moveDown();
        doc.text(reverseArabicText(`رقم كراسي الذهاب: ${ticket?.seats}`), { align: "right" });
        doc.text(reverseArabicText(`رقم كراسي العودة: ${ticket?.Backseats}`), { align: "right" }).moveDown();
        doc.fontSize(16).fillColor("black").text(reverseArabicText(`الإجمالي: ${ticket?.price} جنيه مصري`), { align: "right" });

        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.text(reverseArabicText(` تفاصيل الذهاب:`), { align: "right" });

        // Travel Info
        if (ticket?.StationRoutes && Array.isArray(ticket.StationRoutes)) {
            doc.text(reverseArabicText(`التحرك من: ${ticket.StationRoutes[0]} - ${ticket.takeoff}`), { align: "right" });
        }
        if (ticket?.StationRoutes && ticket.StationRoutes.length > 1) {
            doc.text(reverseArabicText(`الوصول إلى: ${ticket.StationRoutes[1]} - ${ticket.arrive}`), { align: "right" });
        }

        doc.moveDown();
        doc.text(reverseArabicText(` تفاصيل العودة:`), { align: "right" });

        if (ticket?.Back_takeoff && Array.isArray(ticket.Back_StationRoutes)) {
            doc.text(reverseArabicText(`التحرك من: ${ticket.Back_StationRoutes[0]} - ${ticket.Back_takeoff}`), { align: "right" });
        }
        if (ticket?.Back_StationRoutes && ticket.Back_StationRoutes.length > 1) {
            doc.text(reverseArabicText(`الوصول إلى: ${ticket.Back_StationRoutes[1]} - ${ticket.Back_arrive}`), { align: "right" });
        }

        doc.moveDown();

        // Payment Info
        doc.fontSize(14).fillColor("black").text(reverseArabicText(`تم الدفع عن طريق: ${ticket?.paymentMethod}`), { align: "right" });
        if (ticket?.voucher) {
            doc.text(reverseArabicText(`  باستخدام كود شراء: ${ticket?.voucher?.code}`), { align: "right" });
        }

        doc.moveDown();
        doc.fontSize(40).fillColor("green").text(reverseArabicText("نتمني  لكم رحلة آمنه و سعيدة"), { align: "center" }).moveDown();

        // Finalize PDF and send it directly to the user
        doc.end();
    } catch (err) {
        console.error("Error generating PDF:", err);
        res.status(500).json({ error: err });
    }
};