import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../domain/exceptions/domainError';
import { NotFoundError } from '../../domain/exceptions/notFoundError';
import { ValidationError } from '../../domain/exceptions/validationError';

export const expressErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
    console.error(err.stack);

    const errorResponse = {
        success: false,
        error: {
            message: '',
            code: '',
            details: undefined as string[] | undefined | string
        }
    };

    if (err instanceof NotFoundError) {
        errorResponse.error.message = err.message;
        errorResponse.error.code = 'NOT_FOUND';
        return res.status(404).json(errorResponse);
    }

    if (err instanceof ValidationError) {
        errorResponse.error.message = err.message;
        errorResponse.error.code = 'VALIDATION_ERROR';
        errorResponse.error.details = err.errors;
        return res.status(400).json(errorResponse);
    }

    if (err instanceof DomainError) {
        errorResponse.error.message = err.message;
        errorResponse.error.code = 'DOMAIN_ERROR';
        return res.status(400).json(errorResponse);
    }

    errorResponse.error.message = 'Algo salió mal en el servidor.';
    errorResponse.error.code = 'INTERNAL_SERVER_ERROR';
    
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.error.details = err.stack;
    }
    
    res.status(500).json(errorResponse);
};