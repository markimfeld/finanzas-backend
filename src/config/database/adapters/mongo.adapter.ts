import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        // ✅ Activar logs de consultas MongoDB
        mongoose.set('debug', true);

        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};

export const disconnectMongo = async () => {
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
}