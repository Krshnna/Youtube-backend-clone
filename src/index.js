import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/database.js"
import app from "./app.js";

dotenv.config();
connectDB();


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at ${process.env.PORT}`)
})