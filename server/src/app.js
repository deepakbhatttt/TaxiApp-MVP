import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//**CORS Configuration**//
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({limit: "16kb"}));
//app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());


//**Routes**//
import userRouter from './routes/user.routes.js';

//**User Routes Decleration**//
app.use("/api/v1/users", userRouter);

export {app};