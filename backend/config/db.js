import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();
// export const connectDB = async () => {
//     const conn = await mongoose.connect(process.env.MONGO_URI).then(console.log("Connected to MongoDB")).catch(err => console.log("Failed to connect to MongoDB", err));
// }

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(console.log('MongoDB connected')).catch(err => console.log("Failed to connect to MongoDB", err));
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
