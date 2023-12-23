import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async() => {
  await mongoose
    .connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    .then((con) => {
      console.log(`Database Connected Successfully at ${con.connection.host}`);
    })
    .catch((err) => {
      console.log("Error in connecting to database!!");
      process.exit(1);
    });
};
export default connectDB;
