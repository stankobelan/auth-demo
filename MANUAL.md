# Angular Authentication Demo - Student Manual

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure Explained](#project-structure-explained)
4. [Authentication Features](#authentication-features)
5. [Guards and Route Protection](#guards-and-route-protection)
6. [HTTP Interceptors](#http-interceptors)
7. [Components in Detail](#components-in-detail)
8. [Practical Exercises](#practical-exercises)
9. [Advanced Topics](#advanced-topics)
10. [Troubleshooting](#troubleshooting)

## Introduction

This Angular Authentication Demo is designed as an educational resource to help you understand modern authentication patterns and Angular best practices. Through this project, you'll learn how to implement secure authentication, protect routes, manage user sessions, and handle HTTP requests efficiently.

## Getting Started

### Prerequisites
- Node.js (v16+) and npm installed
- Basic understanding of Angular, TypeScript, and web development
- Code editor (VS Code recommended)

### Installation and Setup

1. Clone or download the project
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open your browser and navigate to `http://localhost:4200`

## Project Structure Explained

This project follows Angular's recommended architecture and contains:

### Key Directories

- **app/components/**: All UI components organized by feature
- **app/services/**: Services for data management and business logic
- **app/guards/**: Route guards for access control
- **app/interceptors/**: HTTP request/response interceptors
- **app/models/**: TypeScript interfaces and classes
- **app/helpers/**: Utility functions and reusable code

### Important Files

- **app.routes.ts**: Application routing configuration
- **auth.service.ts**: Core authentication service
- **token-helper.ts**: JWT token management utilities
- **auth.guard.ts**: Primary route protection implementation

## Authentication Features

### User Authentication Flow

1. User enters credentials on the login form
2. The auth service validates credentials against the backend
3. Upon successful login, a JWT token is stored
4. The token is included in subsequent API requests via the auth interceptor
5. Protected routes check authentication status via guards

### Token Management

- **Storage**: Secure token storage in browser storage
- **Expiration**: Automatic handling of token expiration
- **Renewal**: Token refresh patterns for extended sessions

### Authentication State Management

- Observable-based auth state accessible throughout the app
- Reactive updates when auth state changes

## Guards and Route Protection

### Auth Guard

Located in `app/guards/auth.guard.ts`, this guard:
- Verifies if the user is authenticated before allowing route access
- Redirects unauthenticated users to the login page
- Uses `CanActivate` interface from Angular Router

Example usage (from app.routes.ts):
```typescript
{
  path: 'protected',
  component: ProtectedComponent,
  canActivate: [AuthGuard]
}
```

### Auth-Child Guard

Located in `app/guards/auth-child.guard.ts`, this guard:
- Protects child routes within a feature module
- Implements `CanActivateChild` interface

### Unsaved Changes Guard

Located in `app/guards/unsaved-changes.guard.ts`, this guard:
- Prevents accidental navigation away from forms with unsaved changes
- Implements `CanDeactivate` interface
- Shows confirmation dialog before allowing navigation

## HTTP Interceptors

### Auth Interceptor

Located in `app/interceptors/auth.interceptor.ts`, this interceptor:
- Automatically attaches the authentication token to all HTTP requests
- Handles token refreshing logic

### Error Interceptor

Located in `app/interceptors/error.interceptor.ts`, this interceptor:
- Catches HTTP errors globally
- Handles authentication errors (e.g., 401 Unauthorized)
- Provides consistent error handling across the application

### Caching Interceptor

Located in `app/interceptors/caching.interceptor.ts`, this interceptor:
- Implements client-side caching for GET requests
- Improves application performance by reducing redundant API calls

### Timing Interceptor

Located in `app/interceptors/timing.interceptor.ts`, this interceptor:
- Measures and logs the time taken for HTTP requests
- Useful for performance monitoring and debugging

## Components in Detail

### Home Component
The landing page accessible to all users, demonstrating public routes.

### Auth Component
Handles login and registration with form validation and error handling.

### Protected Component
Example of a route that requires authentication to access.

### Admin Component
Demonstrates role-based authorization, accessible only to admin users.

### Users Component
Displays user management interface with CRUD operations.

### Edit Profile Component
Form-based component for editing user information with validation.

### Settings Component
User preferences and application settings management.

### Header Component
Navigation and user status display, with dynamic content based on auth state.

## Practical Exercises

### Exercise 1: Extend User Registration
Add additional fields to the registration form and update the relevant models and services.

### Exercise 2: Implement Password Reset
Create a new component and service for password reset functionality.

### Exercise 3: Add Role-Based UI Elements
Modify the header component to show different navigation options based on user roles.

### Exercise 4: Create a New Protected Feature
Add a new protected component with its own route and guard.

## Advanced Topics

### JWT Token Decoding
The application demonstrates how to safely decode and use information from JWT tokens.

### Route Resolvers
Used for pre-fetching data before a component loads, as seen in the task resolver.

### Dialog Components
The project uses Angular Material dialogs for confirmations and edits.

### Form Validation Strategies
Both template-driven and reactive forms are demonstrated with various validation techniques.

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check browser console for errors
   - Verify token expiration and storage
   - Confirm backend API endpoints are correct

2. **Route Guard Failures**
   - Ensure auth service is properly providing authentication state
   - Check for circular dependencies in guard implementations

3. **HTTP Interceptor Problems**
   - Verify interceptor order in app.module.ts
   - Check for proper error handling

### Getting Help

- Consult the Angular documentation: https://angular.io/docs
- Search Stack Overflow with the tag [angular]
- Review the HTTP client documentation: https://angular.io/guide/http

## Further Development

As you become comfortable with the concepts in this demo, consider:

1. Implementing OAuth/OpenID Connect authentication
2. Adding two-factor authentication
3. Creating more sophisticated role-based access control
4. Incorporating WebSockets for real-time features

This manual should help you navigate and understand the Angular Authentication Demo project. Happy coding!

