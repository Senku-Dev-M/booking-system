import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../../domain/exceptions/validationError';

export const validateFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];
    
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      const errorMessage = `Campos obligatorios faltantes: ${missingFields.join(', ')}`;
      return next(new ValidationError(errorMessage, missingFields));
    }
        next();
  };
};

export const validateNumericFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const invalidFields: string[] = [];
    
    for (const field of fields) {
      if (req.body[field] !== undefined && isNaN(Number(req.body[field]))) {
        invalidFields.push(field);
      }
    }
    
    if (invalidFields.length > 0) {
      const errorMessage = `Los siguientes campos deben ser números: ${invalidFields.join(', ')}`;
      return next(new ValidationError(errorMessage, invalidFields));
    }
    
    next();
  };
};