# Components Documentation

## Contact Form Component

The `contact-form` web component provides a fully-featured contact form with validation, loading states, and error handling.

### Usage

```html
<contact-form action="https://formsubmit.co/ajax/your-email@example.com"></contact-form>
```

### Configuration

#### Form Submission Endpoint

The component uses the `action` attribute to specify where form submissions should be sent. By default, it's configured to use FormSubmit.co:

```html
<contact-form action="https://formsubmit.co/ajax/contact.chatkawin@gmail.com"></contact-form>
```

**To configure your own email:**
1. Replace `contact.chatkawin@gmail.com` with your email address
2. The first time you submit the form, FormSubmit.co will send a confirmation email
3. Click the confirmation link to activate the endpoint

#### Alternative Services

You can use other form submission services by changing the `action` attribute:

- **Formspree**: `https://formspree.io/f/YOUR_FORM_ID`
- **Getform**: `https://getform.io/f/YOUR_FORM_ID`
- **Custom Backend**: Point to your own API endpoint

### Features

- **Real-time Validation**: Fields are validated as users type and on blur
- **Error Messages**: Clear, user-friendly error messages for each field
- **Loading States**: Visual feedback during form submission
- **Success/Error Notifications**: Alerts users of submission status
- **Auto-clear**: Form clears automatically 2 seconds after successful submission
- **Spam Prevention**: Honeypot field to prevent bot submissions
- **Accessibility**: Full ARIA support and keyboard navigation

### Validation Rules

- **Name**: Required, 2-100 characters
- **Email**: Required, valid email format (RFC 5322 basic)
- **Subject**: Required, 3-200 characters
- **Message**: Required, 10-2000 characters

### Styling

The component uses scoped styles that match the portfolio theme. All styles are contained within the component's shadow DOM equivalent (using `:host` selector).

### Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS 13+, Android 8+

## Form Validator Utility

The `form-validator.js` utility provides reusable validation functions:

```javascript
import { validateRequired, validateEmail, validateLength, validateForm } from '../utils/form-validator.js';

// Validate individual fields
validateRequired('value'); // Returns boolean
validateEmail('test@example.com'); // Returns boolean
validateLength('value', 2, 100); // Returns boolean

// Validate entire form
const result = validateForm({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test',
  message: 'Hello world'
});

// result = { isValid: true/false, errors: { fieldName: 'error message' } }
```

### Functions

#### `validateRequired(value)`
Checks if a value is not empty after trimming whitespace.

#### `validateEmail(email)`
Validates email format using RFC 5322 basic pattern.

#### `validateLength(value, min, max)`
Checks if string length (after trimming) is within min/max bounds.

#### `validateForm(formData)`
Validates all form fields and returns validation result with errors.

## Mobile Menu Component

See the existing mobile menu component for navigation functionality.
