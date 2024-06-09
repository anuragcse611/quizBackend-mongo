
import mongoose from 'mongoose';
//import { DB_NAME } from '../constants';

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async() =>{
    try {
        const connection = await mongoose.connect(`${MONGODB_URI}/WebSkitters`);
        console.log(`\n MongoDB connected: '${connection.connection.host}`);
    } catch (error) {
        console.log("Failed to connect DB ", error);
        process.exit(1);
    }
}

export default connectDB;
