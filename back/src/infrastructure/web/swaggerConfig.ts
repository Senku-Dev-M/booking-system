import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import path from 'path';
import { Application } from 'express';

export const setupSwagger = (app: Application) => {
    const swaggerFilePath = path.resolve(__dirname, '../../../src/api-docs.json');

    let swaggerDocument: any;

    try {
        const fileContents = fs.readFileSync(swaggerFilePath, 'utf8');
        swaggerDocument = JSON.parse(fileContents);
    } catch (error) {
        console.error('Error al cargar o parsear api-docs.json:', error);
        swaggerDocument = {
            openapi: '3.0.0',
            info: {
                title: 'Error de Carga API',
                version: '1.0.0',
                description: 'No se pudo cargar la especificacion OpenAPI. Revise api-docs.json.'
            },
            paths: {}
        };
    }

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger UI disponible en /api-docs');
};