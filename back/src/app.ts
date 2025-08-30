import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './infrastructure/database/mongoConnection';
import { expressErrorHandler } from './infrastructure/web/expressErrorHandler';
import { setupSwagger } from './infrastructure/web/swaggerConfig';
import passport from './infrastructure/web/passportConfig';
import { authMiddleware } from './infrastructure/web/authMiddleware';
import { loggerMiddleware } from './interfaces/http/middlewares/loggerMiddleware';

import hotelRoutes from './interfaces/http/routes/hotelRoutes';
import roomRoutes from './interfaces/http/routes/roomRoutes';
import authRoutes from './interfaces/http/routes/authRoutes';

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use(loggerMiddleware());

app.use(passport.initialize());

setupSwagger(app);

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Versión corregida
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(expressErrorHandler);

export default app;