import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import prisma from "./lib/prisma.js"

import landingRouter from "./routes/landing.js"
import searchRouter from "./routes/search.js"
import PaymentRouter from "./routes/paymentRouter.js"
import TicketRouter from "./routes/ticketRouter.js"
import TermsRouter from "./routes/termsRouter.js" 
import cleanup from "./middlewares/clear.js";

import { failureResponse, successResponse } from "./utils/apiResponse.js";
import path from "path";
import { fileURLToPath } from "url";
import * as fingerprintModule from "express-fingerprint";
const fingerprint = (fingerprintModule as any).default || fingerprintModule;




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// app.use(cleanup) ;




app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use("/en",express.static(path.join(__dirname, 'public')));
app.use("/policy",express.static(path.join(__dirname, 'public')));
app.use("/terms",express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');


  


app.use(cors());
app.use(express.json());





app.use(fingerprint());


app.use(searchRouter) ;
app.use(landingRouter);	
app.use(PaymentRouter) ;
app.use(TicketRouter) ;
app.use(TermsRouter) ;
app.get('/download' , (req: Request, res: Response) => {
	res.render("download");
});

app.get('/downloadapp' , (req: Request, res: Response) => {
	res.download(path.join(__dirname, 'public', 'swiftbus.apk'));
});





app.use((req: Request, res: Response) => {
	res.redirect("/");
});

app.use((error:any , req: Request, res: Response) => {
	console.log(error) ;
	res.redirect("/");
});



export default app;
