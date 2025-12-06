import mongoose from 'mongoose';

export default async function connectDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not set in .env');
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri)
    //     await mongoose.connect(uri, { dbName: uri.split('/').pop(), });
    //     console.log('MongoDB connected');
}
