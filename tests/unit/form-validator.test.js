import { describe, it, expect } from 'vitest';
import { validateRequired, validateEmail, validateLength, validateForm } from '../../utils/form-validator.js';

describe('Form Validator', () => {
  describe('validateRequired', () => {
    it('should return true for non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('  test  ')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user_name@example-domain.com')).toBe(true);
    });

    it('should return false for invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validateLength', () => {
    it('should return true for strings within bounds', () => {
      expect(validateLength('test', 2, 10)).toBe(true);
      expect(validateLength('ab', 2, 10)).toBe(true);
      expect(validateLength('1234567890', 2, 10)).toBe(true);
    });

    it('should return false for strings outside bounds', () => {
      expect(validateLength('a', 2, 10)).toBe(false);
      expect(validateLength('12345678901', 2, 10)).toBe(false);
    });

    it('should trim whitespace before checking length', () => {
      expect(validateLength('  test  ', 2, 10)).toBe(true);
      expect(validateLength('  a  ', 2, 10)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(validateLength(null, 2, 10)).toBe(false);
      expect(validateLength(undefined, 2, 10)).toBe(false);
    });
  });

  describe('validateForm', () => {
    it('should return valid for complete valid form data', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters.'
      };

      const result = validateForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for empty required fields', () => {
      const formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };

      const result = validateForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.subject).toBe('Subject is required');
      expect(result.errors.message).toBe('Message is required');
    });

    it('should return error for invalid email', () => {
      const formData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters.'
      };

      const result = validateForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    it('should return errors for fields with invalid length', () => {
      const formData = {
        name: 'A', // Too short (min 2)
        email: 'test@example.com',
        subject: 'AB', // Too short (min 3)
        message: 'Short' // Too short (min 10)
      };

      const result = validateForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name must be between 2 and 100 characters');
      expect(result.errors.subject).toBe('Subject must be between 3 and 200 characters');
      expect(result.errors.message).toBe('Message must be between 10 and 2000 characters');
    });
  });
});
