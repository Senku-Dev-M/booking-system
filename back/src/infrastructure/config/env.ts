import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface EnvConfig {
    port: number;
    mongoUri: string;
}

export const env: EnvConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hotelbookingdb',
};

if (!env.mongoUri) {
    console.error('ERROR: MONGO_URI no esta definida en el archivo .env');
    process.exit(1);
}
if (isNaN(env.port)) {
    console.error('ERROR: PORT no es un numero valido en el archivo .env');
    process.exit(1);
}