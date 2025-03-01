import mongoose from "mongoose";

const connectToDatabase = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
        process.exit(1);
    }
};

export default connectToDatabase;