# Password Reset Feature

This document describes the password reset functionality implemented in the Construction Tech application.

## Overview

The password reset feature allows users to securely reset their passwords when they forget them. The system generates a secure token, sends it via email, and allows users to set a new password using the token.

## Security Features

- **Secure Token Generation**: Uses cryptographically secure random bytes (32 bytes) for token generation
- **Token Expiration**: Tokens expire after 1 hour for security
- **Single Use**: Each token can only be used once
- **Rate Limiting**: Old tokens are automatically deleted when new ones are requested
- **No User Enumeration**: The system doesn't reveal whether an email exists or not

## API Endpoints

### 1. Request Password Reset
```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent.",
  "userId": "user-uuid"
}
```

### 2. Reset Password
```
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password has been reset successfully"
}
```

## Database Schema

### PasswordResetToken Model
```prisma
model PasswordResetToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  used      Boolean  @default(false)

  user      User     @relation("UserPasswordReset", fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
}
```

## Implementation Details

### 1. Password Reset Request Flow
1. User submits email address
2. System checks if user exists
3. If user exists:
   - Generate secure random token
   - Delete any existing tokens for the user
   - Create new token with 1-hour expiration
   - Send password reset email
4. Return success message (regardless of user existence)

### 2. Password Reset Flow
1. User clicks link in email (contains token)
2. User enters new password
3. System validates:
   - Token exists and is valid
   - Token hasn't been used
   - Token hasn't expired
   - New password meets requirements
4. If valid:
   - Hash new password
   - Update user password
   - Mark token as used
   - Delete all tokens for the user
5. Return success message

### 3. Email Template
The password reset email includes:
- Professional styling
- Clear call-to-action button
- Fallback text link
- Security warning about ignoring if not requested
- 1-hour expiration notice

## Environment Variables

```env
FRONTEND_URL=http://localhost:3000  # Frontend URL for reset link generation
```

## Testing

The feature includes comprehensive tests covering:
- Service layer functionality
- API endpoint validation
- Error handling
- Security scenarios
- Edge cases

Run tests with:
```bash
npm test
```

## Security Considerations

1. **Token Security**: 32-byte random tokens are cryptographically secure
2. **Expiration**: 1-hour expiration prevents long-term token abuse
3. **Single Use**: Tokens are invalidated after use
4. **Cleanup**: Old tokens are automatically removed
5. **No Enumeration**: System doesn't reveal user existence
6. **Password Validation**: New passwords must meet security requirements

## Error Handling

The system handles various error scenarios:
- Invalid or expired tokens
- Already used tokens
- Missing required fields
- Password validation failures
- Email service failures (graceful degradation)

## Future Enhancements

Potential improvements could include:
- Rate limiting for password reset requests
- Audit logging for security events
- SMS-based reset for additional security
- Two-factor authentication integration
- Password strength indicators
