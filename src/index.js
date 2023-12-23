import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/database.js"

dotenv.config();

connectDB();