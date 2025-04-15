# Angular Authentication Demo (Educational Project)

## Overview

This educational project demonstrates various authentication and authorization features in Angular, designed for students learning modern web development. The application showcases real-world implementation of security concepts, route guards, HTTP interceptors, and Angular best practices.

## Learning Objectives

This project helps students learn:

- User authentication and authorization flows
- Route protection using Guards
- HTTP Interceptors for token management
- Form validation and user input handling
- Component communication
- Reactive state management
- Dialog components and user interactions

## Project Structure

The application includes several key components:

- **Authentication System**: Complete login, registration, and token management
- **Protected Routes**: Access control using Angular Guards
- **Admin Panel**: Role-based authorization example
- **User Management**: Profile editing and user settings
- **HTTP Interceptors**: Automatic token inclusion, error handling, caching, and request timing
- **Task Management**: Simple CRUD operations with route resolvers

## Component Overview

- **Home**: Landing page accessible to all users
- **Auth**: Login and registration functionality
- **Protected**: Example of a route requiring authentication
- **Admin**: Restricted to users with admin privileges
- **Users**: User management interface
- **Settings**: User preferences and application settings
- **Edit Profile**: User profile management
- **Tasks**: Task management with editing capabilities

## Guards and Interceptors

This project demonstrates multiple security implementations:

- **Auth Guard**: Prevents access to protected routes without authentication
- **Auth-Child Guard**: Protects nested routes
- **Unsaved Changes Guard**: Prevents accidental navigation with pending changes
- **Auth Interceptor**: Automatically attaches authentication tokens to requests
- **Caching Interceptor**: Implements response caching for improved performance
- **Error Interceptor**: Global error handling for HTTP requests
- **Timing Interceptor**: Measures and logs request performance

## Technical Setup

### Development server

Run `ng serve` or use the npm script `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload when source files change.

### Running unit tests

Run `ng test` or use the npm script `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Educational Usage Guide

### For Instructors

1. **Step-by-step walkthroughs**: Use the codebase to explain authentication concepts
2. **Code review exercises**: Ask students to identify security vulnerabilities
3. **Extension activities**: Assign feature enhancements to reinforce learning

### For Students

1. **Feature exploration**: Study how each component and service works
2. **Code analysis**: Review the implementation of guards and interceptors
3. **Hands-on exercises**: Extend functionality with new features

## Advanced Topics Demonstrated

- Token storage and renewal
- HTTP request/response interception
- Form validation strategies
- Dialog component implementation
- Resolver pattern for data fetching
- Route protection strategies

## Further Learning Resources

- [Angular Authentication Documentation](https://angular.io/guide/http#security-interceptors)
- [Route Guards in Angular](https://angular.io/guide/router#milestone-5-route-guards)
- [HTTP Interceptors](https://angular.io/guide/http#intercepting-requests-and-responses)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.
