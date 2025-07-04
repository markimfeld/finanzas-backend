import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });


let mongo: MongoMemoryServer;

// Lo exportamos para poder acceder desde los tests si hace falta
export async function setupMemoryMongoDB() {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
}

export async function teardownMemoryMongoDB() {
    await mongoose.disconnect();
    await mongo.stop();
}