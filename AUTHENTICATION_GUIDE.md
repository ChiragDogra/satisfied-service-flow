# Authentication System Guide

This guide covers the complete authentication system implementation for the Satisfied Computers service management app.

## Features Implemented

✅ **Email/Password Authentication**
- User registration with email and password
- User login with email and password
- Password validation (minimum 6 characters)
- Email validation
- User profile creation in Firestore

✅ **Google Sign-In**
- One-click Google authentication
- Automatic user profile creation
- Fallback to redirect for restricted browsers

✅ **Phone Number Authentication**
- SMS verification code system
- reCAPTCHA integration for security
- Phone number validation and formatting
- Support for international numbers

✅ **Security Features**
- reCAPTCHA protection for phone auth
- Input validation and sanitization
- Comprehensive error handling
- Rate limiting protection
- Secure session management

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Main authentication context
├── components/
│   ├── PhoneLogin.tsx           # Phone authentication component
│   └── AuthTest.tsx            # Test component for all auth methods
├── lib/
│   └── auth-utils.ts           # Authentication utility functions
└── firebase.ts                 # Firebase configuration
```

## Setup Instructions

### 1. Firebase Console Configuration

1. **Enable Authentication Methods:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google (configure OAuth consent screen)
   - Enable Phone (configure reCAPTCHA)

2. **Configure reCAPTCHA:**
   - In Phone authentication settings
   - Add your domain to authorized domains
   - Test reCAPTCHA is working

3. **Set up Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read, write: if request.auth.token.email == 'admin@satisfiedcomputers.com';
    }
  }
}
```

### 2. Environment Variables

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 3. HTML Configuration

The `index.html` file includes the necessary reCAPTCHA scripts:

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
```

## Usage Examples

### Email/Password Authentication

```tsx
import { useAuth } from '../contexts/AuthContext';

const { signIn, signUp, user, loading } = useAuth();

// Sign up
await signUp('user@example.com', 'password123', 'John Doe', '+919876543210');

// Sign in
await signIn('user@example.com', 'password123');
```

### Google Sign-In

```tsx
const { signInWithGoogle } = useAuth();

// One-click Google sign-in
await signInWithGoogle();
```

### Phone Authentication

```tsx
const { signInWithPhone, verifyPhoneCode } = useAuth();

// Send verification code (Indian number)
const confirmationResult = await signInWithPhone('+919876543210');

// Verify code
await verifyPhoneCode(confirmationResult, '123456');
```

## Component Usage

### PhoneLogin Component

```tsx
import PhoneLogin from '../components/PhoneLogin';

<PhoneLogin onClose={() => setShowPhoneLogin(false)} />
```

### AuthTest Component

For testing all authentication methods:

```tsx
import AuthTest from '../components/AuthTest';

<AuthTest />
```

## Error Handling

The system includes comprehensive error handling for:

- **Network errors**: Connection issues, timeouts
- **Validation errors**: Invalid email, weak password, invalid phone
- **Authentication errors**: Wrong credentials, user not found
- **Rate limiting**: Too many requests
- **reCAPTCHA errors**: Verification failures
- **Phone verification**: Invalid codes, expired codes

All errors are displayed as user-friendly messages using toast notifications.

## Security Considerations

1. **reCAPTCHA Protection**: Phone authentication is protected by reCAPTCHA
2. **Input Validation**: All inputs are validated before processing
3. **Rate Limiting**: Firebase automatically handles rate limiting
4. **Secure Sessions**: Firebase manages secure session tokens
5. **Environment Variables**: Sensitive configuration is stored in environment variables

## Testing

Use the `AuthTest` component to test all authentication methods:

1. **Email/Password**: Test registration and login
2. **Google Sign-In**: Test OAuth flow
3. **Phone Authentication**: Test SMS verification (requires real phone number)

## Troubleshooting

### Common Issues

1. **reCAPTCHA not loading**:
   - Check if scripts are included in HTML
   - Verify domain is authorized in Firebase Console

2. **Phone authentication failing**:
   - Ensure phone auth is enabled in Firebase Console
   - Check reCAPTCHA configuration
   - Verify phone number format

3. **Google sign-in not working**:
   - Check OAuth consent screen configuration
   - Verify redirect URIs are correct
   - Ensure Google provider is enabled

4. **Environment variables not loading**:
   - Restart development server after adding .env
   - Check variable names start with VITE_
   - Verify .env file is in project root

### Debug Mode

Enable debug logging by checking browser console for detailed error messages.

## API Reference

### AuthContext Methods

- `signIn(email, password)`: Email/password sign in
- `signUp(email, password, name, phone?)`: Create new account
- `signInWithGoogle()`: Google OAuth sign in
- `signInWithPhone(phoneNumber)`: Send SMS verification code
- `verifyPhoneCode(confirmationResult, code)`: Verify SMS code
- `signOut()`: Sign out current user

### Utility Functions

- `validateEmail(email)`: Validate email format
- `validatePassword(password)`: Check password strength
- `validatePhoneNumber(phone)`: Validate phone number format
- `formatPhoneNumber(phone)`: Format phone number with +91 country code for India
- `getAuthErrorMessage(errorCode)`: Get user-friendly error messages

## Support

For issues with the authentication system:

1. Check browser console for error messages
2. Verify Firebase Console configuration
3. Test with the AuthTest component
4. Check network connectivity
5. Verify environment variables are set correctly
