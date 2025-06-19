import { connectMongo, disconnectMongo } from './adapters/mongo.adapter';

export const connectToDatabase = async () => {
    await connectMongo();
};

export const disconnectToDatabase = async () => {
    await disconnectMongo();
};
