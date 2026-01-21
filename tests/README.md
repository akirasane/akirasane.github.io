# Testing Structure

This directory contains all tests for the portfolio enhancements project.

## Directory Structure

```
tests/
├── unit/              # Unit tests for specific examples and edge cases
├── property/          # Property-based tests for universal properties
├── integration/       # Integration tests for component interactions
├── setup.js          # Test setup and configuration
└── README.md         # This file
```

## Testing Approach

This project uses a **dual testing approach**:

### Unit Tests (`tests/unit/`)
- Test specific examples and edge cases
- Test error conditions
- Test integration points between components
- Use descriptive test names
- Focus on concrete scenarios

### Property-Based Tests (`tests/property/`)
- Test universal properties across all inputs
- Use fast-check for random input generation
- Minimum 100 iterations per property test
- Tag format: `Feature: portfolio-enhancements, Property N: [property text]`
- Each property test references its design document property

### Integration Tests (`tests/integration/`)
- Test complete user flows
- Test component interactions
- Test end-to-end scenarios

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

- **Framework**: Vitest
- **Property Testing**: fast-check
- **Environment**: jsdom (browser-like environment)
- **Minimum iterations**: 100 per property test

## Writing Tests

### Unit Test Example

```javascript
import { describe, it, expect } from 'vitest';

describe('Component Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Property-Based Test Example

```javascript
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

describe('Component Name', () => {
  // Feature: portfolio-enhancements, Property 1: Description
  it('should verify universal property', () => {
    fc.assert(
      fc.property(
        fc.string(), // Random string generator
        (input) => {
          const result = someFunction(input);
          return result.length >= 0; // Property that should always hold
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

## Test Mocks

The following are mocked in `setup.js`:
- `localStorage`
- `IntersectionObserver`
- `ResizeObserver`
- `requestAnimationFrame`
- `cancelAnimationFrame`

## Best Practices

1. **Keep tests focused**: One assertion per test when possible
2. **Use descriptive names**: Test names should explain what is being tested
3. **Clean up**: Tests clean up DOM between runs automatically
4. **Avoid mocks when possible**: Test real functionality
5. **Property tests for coverage**: Use property tests to cover many inputs
6. **Unit tests for specifics**: Use unit tests for specific edge cases
