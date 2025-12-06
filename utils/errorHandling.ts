// Centralized error handling utilities

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ContractError extends AppError {
  constructor(message: string, public readonly contractAddress?: string) {
    super(message, 'CONTRACT_ERROR', 400);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, public readonly network?: string) {
    super(message, 'NETWORK_ERROR', 503);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

export function handleContractError(error: any): AppError {
  if (error?.code === 'NETWORK_ERROR') {
    return new NetworkError('Network connection failed. Please check your internet connection.');
  }

  if (error?.code === 'TIMEOUT') {
    return new NetworkError('Request timed out. Please try again.');
  }

  if (error?.code === 'INSUFFICIENT_FUNDS') {
    return new ContractError('Insufficient funds for transaction.');
  }

  if (error?.code === 'USER_REJECTED') {
    return new ContractError('Transaction cancelled by user.');
  }

  if (error?.message?.includes('reverted')) {
    return new ContractError(error.message);
  }

  if (error?.message?.includes('gas')) {
    return new ContractError('Transaction failed due to gas issues.');
  }

  return new AppError(error?.message || 'An unexpected error occurred');
}

export function handleValidationError(field: string, value: any, rules: Record<string, any>): ValidationError | null {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return new ValidationError(`${field} is required`, field);
  }

  if (rules.minLength && value?.length < rules.minLength) {
    return new ValidationError(`${field} must be at least ${rules.minLength} characters`, field);
  }

  if (rules.maxLength && value?.length > rules.maxLength) {
    return new ValidationError(`${field} must be less than ${rules.maxLength} characters`, field);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return new ValidationError(`${field} format is invalid`, field);
  }

  return null;
}

export function isRetryableError(error: any): boolean {
  const retryableCodes = [
    'NETWORK_ERROR',
    'TIMEOUT',
    'SERVER_ERROR',
    500, 502, 503, 504
  ];

  return retryableCodes.includes(error?.code) || retryableCodes.includes(error?.statusCode);
}

export function getErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

export function logError(error: any, context?: Record<string, any>): void {
  const errorInfo = {
    message: getErrorMessage(error),
    code: error?.code,
    statusCode: error?.statusCode,
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  console.error('Application Error:', errorInfo);

  // In production, you might want to send this to a logging service
  // logToService(errorInfo);
}
