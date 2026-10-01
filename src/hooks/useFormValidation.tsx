// @ts-nocheck
import { useState, useCallback } from 'react';
import { useUnifiedErrorHandler } from './useUnifiedErrorHandler';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const { handleError } = useUnifiedErrorHandler();

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = schema[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rule.maxLength} characters`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [schema]);

  const validateSingleField = useCallback((name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return !error;
  }, [validateField]);

  const validateForm = useCallback((data: Record<string, any>): boolean => {
    setIsValidating(true);
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(schema).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setIsValidating(false);

    if (!isValid) {
      const errorCount = Object.keys(newErrors).length;
      handleError(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before submitting`);
    }

    return isValid;
  }, [schema, validateField, handleError]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  const hasErrors = Object.values(errors).some(error => error !== '');

  return {
    errors,
    isValidating,
    validateField: validateSingleField,
    validateForm,
    clearErrors,
    clearFieldError,
    hasErrors
  };
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
};

// Common validation schemas
export const commonSchemas = {
  client: {
    name: { required: true, minLength: 2, maxLength: 100 },
    description: { maxLength: 500 },
    website: { pattern: validationPatterns.url },
    slug: { required: true, pattern: validationPatterns.slug },
    industry: { maxLength: 100 },
    country: { maxLength: 100 }
  },
  service: {
    title: { required: true, minLength: 2, maxLength: 100 },
    short_description: { required: true, maxLength: 200 },
    long_description: { maxLength: 2000 },
    slug: { required: true, pattern: validationPatterns.slug }
  },
  product: {
    name: { required: true, minLength: 2, maxLength: 100 },
    description: { maxLength: 1000 },
    website_url: { pattern: validationPatterns.url },
    slug: { required: true, pattern: validationPatterns.slug }
  },
  teamMember: {
    name: { required: true, minLength: 2, maxLength: 100 },
    position: { required: true, maxLength: 100 },
    bio: { maxLength: 500 },
    email: { pattern: validationPatterns.email },
    linkedin: { pattern: validationPatterns.url }
  },
  companyInfo: {
    title: { required: true, minLength: 2, maxLength: 100 },
    content: { required: true, minLength: 10 },
    vision: { maxLength: 500 },
    mission: { maxLength: 500 }
  }
};
