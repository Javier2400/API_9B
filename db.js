import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export  const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Mongo DB Connection Succesfully");
    }catch(error) {
        console.error("Mongo DB Connection Failed");
    }
};