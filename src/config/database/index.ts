import { connectMongo } from './adapters/mongo.adapter';

export const connectToDatabase = async () => {
    await connectMongo();
};
