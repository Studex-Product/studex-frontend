# Mock Server Authentication API Documentation

## Overview
This document outlines the authentication API endpoints and their expected request/response formats for the StudEx application.

## Base URL
```
VITE_STUDEX_BASE_URL=https://eb562eb2-ffd2-4cc2-a712-d5423b2ecece.mock.pstmn.io
```

## Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Please verify your account.",
  "data": {
    "id": "user_12345",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": "This email is already registered"
  }
}
```

### 2. Account Verification
**Endpoint:** `POST /api/auth/verify-account`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "verificationCode": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account verified successfully!",
  "data": {
    "id": "user_12345",
    "email": "john.doe@example.com",
    "isVerified": true,
    "verifiedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid verification code",
  "errors": {
    "verificationCode": "The verification code is incorrect or expired"
  }
}
```

### 3. Email Verification
**Endpoint:** `POST /api/auth/verify-email`

**Request Body:**
```json
{
  "token": "email_verification_token_here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "data": {
    "id": "user_12345",
    "email": "john.doe@example.com",
    "emailVerified": true,
    "emailVerifiedAt": "2024-01-15T11:15:00Z"
  }
}
```

### 4. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_12345",
      "email": "john.doe@example.com",
      "fullName": "John Doe",
      "isVerified": true,
      "role": "student"
    }
  }
}
```

### 5. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent! Check your inbox.",
  "data": {
    "email": "john.doe@example.com",
    "resetTokenSent": true,
    "expiresAt": "2024-01-15T12:30:00Z"
  }
}
```

### 6. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_password_token_here",
  "newPassword": "NewSecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful! You can now login.",
  "data": {
    "id": "user_12345",
    "email": "john.doe@example.com",
    "passwordResetAt": "2024-01-15T12:45:00Z"
  }
}
```

### Environment Setup
Add to your `.env` file:
```bash
VITE_STUDEX_BASE_URL=https://eb562eb2-ffd2-4cc2-a712-d5423b2ecece.mock.pstmn.io
```
## Testing Flow

1. **Registration Flow:**
   - User fills registration form
   - Submit → API call → Success toast → Show verification screen

2. **Verification Flow:**
   - User clicks verification
   - API call → Success toast → Redirect to login


## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": {
    "field_name": "Specific field error message"
  },
  "code": "ERROR_CODE_OPTIONAL"
}
```

## Rate Limiting (Mock)
- Registration: 5 requests per minute
- Login: 10 requests per minute
- Verification: 3 requests per minute

## Notes
- Passwords should be at least 8 characters
- Email format validation on client and server