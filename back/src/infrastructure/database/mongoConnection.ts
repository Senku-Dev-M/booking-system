import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log('MongoDB conectado exitosamente.');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1);
    }
};