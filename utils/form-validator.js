/**
 * Form Validator Utility
 * Provides validation functions for contact form fields
 */

/**
 * Validates if a field is not empty
 * @param {string} value - The value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Validates email format (RFC 5322 basic)
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format, false otherwise
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // RFC 5322 basic email validation pattern
  // Allows: local-part@domain
  // Local part: alphanumeric, dots, hyphens, underscores
  // Domain: alphanumeric, dots, hyphens with TLD
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates string length within min/max bounds
 * @param {string} value - The value to validate
 * @param {number} min - Minimum length (inclusive)
 * @param {number} max - Maximum length (inclusive)
 * @returns {boolean} - True if length is within bounds, false otherwise
 */
export function validateLength(value, min, max) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Validates an entire form object
 * @param {Object} formData - Object containing form field values
 * @param {string} formData.name - Name field
 * @param {string} formData.email - Email field
 * @param {string} formData.subject - Subject field
 * @param {string} formData.message - Message field
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export function validateForm(formData) {
  const errors = {};
  let isValid = true;

  // Validate name (required, 2-100 chars)
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
    isValid = false;
  } else if (!validateLength(formData.name, 2, 100)) {
    errors.name = 'Name must be between 2 and 100 characters';
    isValid = false;
  }

  // Validate email (required, valid format)
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Validate subject (required, 3-200 chars)
  if (!validateRequired(formData.subject)) {
    errors.subject = 'Subject is required';
    isValid = false;
  } else if (!validateLength(formData.subject, 3, 200)) {
    errors.subject = 'Subject must be between 3 and 200 characters';
    isValid = false;
  }

  // Validate message (required, 10-2000 chars)
  if (!validateRequired(formData.message)) {
    errors.message = 'Message is required';
    isValid = false;
  } else if (!validateLength(formData.message, 10, 2000)) {
    errors.message = 'Message must be between 10 and 2000 characters';
    isValid = false;
  }

  return {
    isValid,
    errors
  };
}
