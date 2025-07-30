import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging line
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected successfully");
        
    } catch (error) {
        console.error("Error connecting to MongoDb", error);
        process.exit(1) //Exit with failure
    }
}

export default connectDB;
