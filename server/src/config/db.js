import mongoose from 'mongoose';

export async function connectDb(mongoUri) {
    // Set mongoose to use strict query mode
    //strict query is a mongoose option that ensures queries adhere strictly to the schema definitions.
    mongoose.set('strictQuery', true);

    // Connect to MongoDB
    try {
        await mongoose.connect(mongoUri,);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}