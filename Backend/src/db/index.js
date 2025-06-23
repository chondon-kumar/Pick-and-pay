import mongoose from "mongoose";
import { config } from "dotenv";
import { DB_NAME } from "../../constant";

config()

const connectDB = async ( ) => {
    if(!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the environment variables");
    }
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
            dbName: DB_NAME
        });
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
        
    }
}

export default connectDB;