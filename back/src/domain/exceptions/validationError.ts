import { DomainError } from './domainError';

export class ValidationError extends DomainError {
    public errors?: string[];

    constructor(message: string, errors?: string[]) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}