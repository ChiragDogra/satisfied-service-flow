# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the Satisfied Computers service management app.

## Prerequisites

1. A Firebase project (create one at https://console.firebase.google.com)
2. Node.js and npm installed

## Installation Steps

### 1. Install Firebase Dependencies

```bash
npm install firebase
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name: "satisfied-computers" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 3. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following sign-in methods:
   - **Email/Password**: Click "Email/Password" → Enable → Save
   - **Google**: Click "Google" → Enable → Add project support email → Save
   - **Facebook**: Click "Facebook" → Enable → Add App ID and App Secret → Save
   - **GitHub**: Click "GitHub" → Enable → Add Client ID and Client Secret → Save
   - **Phone**: Click "Phone" → Enable → Save

### 4. Create Admin User

1. In Authentication → Users tab
2. Click "Add user"
3. Email: `admin@satisfiedcomputers.com`
4. Password: Set a secure password
5. Click "Add user"

### 5. Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### 6. Configure Firestore Security Rules

1. Go to Firestore Database → Rules tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Admin has full access
      allow read, write: if request.auth.token.email == 'admin@satisfiedcomputers.com';
    }
  }
}
```

3. Click "Publish"

### 7. Get Firebase Configuration

1. Go to Project Settings (gear icon) → General tab
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) icon
4. Enter app nickname: "satisfied-computers-web"
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

### 8. Create Environment File

Create a `.env` file in your project root with the Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

Replace the placeholder values with your actual Firebase configuration values.

### 9. Set up Social Login Providers

#### Google Sign-In
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to "APIs & Services" → "Credentials"
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)

#### Facebook Login
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app
3. Add Facebook Login product
4. Set up OAuth redirect URIs
5. Copy App ID and App Secret to Firebase

#### GitHub Login
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL
4. Copy Client ID and Client Secret to Firebase

### 10. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`

3. Test the following flows:
   - Register a new customer account
   - Sign in with email/password
   - Sign in with Google/Facebook/GitHub
   - Sign in with phone number (OTP)
   - Sign in as admin (`admin@satisfiedcomputers.com`)
   - Verify redirects to correct dashboards

## Features Implemented

✅ **Email/Password Authentication**
✅ **Google Sign-In**
✅ **Facebook Login**
✅ **GitHub Login**
✅ **Phone Number Authentication (OTP)**
✅ **Admin Dashboard** (admin@satisfiedcomputers.com)
✅ **Customer Dashboard**
✅ **Protected Routes**
✅ **Persistent Sessions**
✅ **Firestore User Profiles**
✅ **Toast Notifications**
✅ **Responsive Design**

## Troubleshooting

### Common Issues

1. **Firebase configuration not loading**
   - Check that `.env` file is in project root
   - Verify all environment variables start with `VITE_`
   - Restart development server after adding `.env`

2. **Social login not working**
   - Verify OAuth redirect URIs are correctly set
   - Check that social providers are enabled in Firebase
   - Ensure App ID/Secret are correct

3. **Phone authentication failing**
   - Check that phone authentication is enabled
   - Verify reCAPTCHA is working
   - Test with a real phone number

4. **Admin access not working**
   - Verify admin user exists in Firebase Authentication
   - Check email matches exactly: `admin@satisfiedcomputers.com`
   - Ensure user is verified

### Support

For issues with Firebase setup, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)




