# Firebase Authentication Setup Guide

This project uses Firebase Authentication for user login and registration.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "City Pulse Explorer")
5. Copy the Firebase configuration object

## Step 4: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Replace the placeholder values with your actual Firebase config values

## Step 5: Restart Your Development Server

After setting up the environment variables, restart your Next.js dev server:

```bash
npm run dev
```

## Usage

### Login Page
Navigate to `/login` to access the login page.

### Register Page
Navigate to `/register` to create a new account.

### Using Authentication in Components

```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, login, logout, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Features

- ✅ Email/Password authentication
- ✅ User registration with optional display name
- ✅ Persistent authentication state (localStorage)
- ✅ Automatic auth state synchronization
- ✅ Error handling with user-friendly messages
- ✅ Type-safe authentication with TypeScript

## Security Notes

- Never commit `.env.local` to version control
- The `.env.local.example` file is safe to commit
- Firebase handles password hashing and security automatically
- All authentication is handled server-side by Firebase

