// Database transaction handler for admin operations
import { getErrorMessage, logError, reportError } from './errorHandler';

export interface TransactionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class TransactionHandler {
  private static instance: TransactionHandler;
  
  static getInstance(): TransactionHandler {
    if (!TransactionHandler.instance) {
      TransactionHandler.instance = new TransactionHandler();
    }
    return TransactionHandler.instance;
  }

  async executeTransaction<T>(
    operations: Array<() => Promise<any>>,
    context: string
  ): Promise<TransactionResult<T>> {
    try {
      const results: any[] = [];
      
      // Execute all operations sequentially
      // Note: Without database-level transactions, we handle failures by manual cleanup
      for (let i = 0; i < operations.length; i++) {
        try {
          const result = await operations[i]();
          if (result.error) {
            throw new Error(`Operation ${i + 1} failed: ${getErrorMessage(result.error)}`);
          }
          results.push(result.data);
        } catch (operationError) {
          // Log the operation that failed
          logError(`${context} - Operation ${i + 1}`, operationError);
          throw operationError;
        }
      }

      return {
        success: true,
        data: results as T
      };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logError(context, error);
      reportError(context, error);

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<TransactionResult<T>> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        return {
          success: true,
          data: result
        };
      } catch (error) {
        lastError = error;
        logError(`${context} (attempt ${attempt}/${maxRetries})`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    const errorMessage = getErrorMessage(lastError);
    reportError(context, lastError);
    
    return {
      success: false,
      error: `Operation failed after ${maxRetries} attempts: ${errorMessage}`
    };
  }

  async validateAndExecute<T>(
    data: any,
    validationRules: ValidationRule[],
    operation: () => Promise<T>,
    context: string
  ): Promise<TransactionResult<T>> {
    // Validate data first
    const validationErrors = this.validateData(data, validationRules);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: `Validation failed: ${validationErrors.join(', ')}`
      };
    }

    // Execute with retry
    return this.withRetry(operation, context);
  }

  private validateData(data: any, rules: ValidationRule[]): string[] {
    const errors: string[] = [];
    
    for (const rule of rules) {
      if (rule.required && (!data[rule.field] || data[rule.field].trim() === '')) {
        errors.push(`${rule.field} is required`);
      }
      
      if (rule.minLength && data[rule.field] && data[rule.field].length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }
      
      if (rule.maxLength && data[rule.field] && data[rule.field].length > rule.maxLength) {
        errors.push(`${rule.field} must not exceed ${rule.maxLength} characters`);
      }

      if (rule.pattern && data[rule.field] && !rule.pattern.test(data[rule.field])) {
        errors.push(`${rule.field} format is invalid`);
      }
    }
    
    return errors;
  }
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

// Singleton instance
export const transactionHandler = TransactionHandler.getInstance();