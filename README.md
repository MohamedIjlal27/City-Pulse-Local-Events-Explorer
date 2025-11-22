# City Pulse – Local Events Explorer

A modern React/Next.js application for discovering and exploring local events using the Ticketmaster Discovery API. Built with TypeScript, Tailwind CSS, and Firebase Authentication.

## 🚀 Features

- **Event Search**: Search for events by keyword and city using Ticketmaster Discovery API
- **Event Details**: View comprehensive event information with images, dates, locations, and pricing
- **Favorites**: Save and manage favorite events locally
- **Multi-language Support**: Toggle between English and Arabic with RTL layout support
- **User Authentication**: Firebase authentication with Email/Password, Email Link, and Google Sign-In
- **User Profile**: Display user information, saved events, and preferences
- **Responsive Design**: Mobile-first design with dark mode support
- **Local Data Persistence**: All user data saved to localStorage

## 📋 Requirements Checklist

### ✅ Core Requirements

- [x] **Home screen**: Search for events (keyword + city) using public API
- [x] **View event detail screen**: Comprehensive event information display
- [x] **User can mark favourite events**: Save/unsave events with localStorage persistence
- [x] **Toggle UI between English and Arabic**: Full RTL support with translations
- [x] **Navigation**: Splash Screen → Home → Event Details → Profile
- [x] **Display user profile**: User info, avatar, and saved events

### ✅ Expectations

- [x] **User data saved locally**: All data persisted in localStorage
- [x] **Common bridging folder**: Business logic in `lib/` directory
- [x] **Clean, modular code**: Well-structured and maintainable
- [x] **README with setup instructions**: This file

### ⭐ Bonus Features

- [x] **Login & Sign Up pages**: Firebase authentication implemented
- [x] **Map preview in event details**: Interactive map with Leaflet showing event location
- [ ] **Bio-metric login**: Not implemented

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project (for authentication)
- Ticketmaster API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd city-pulse-local-events-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Ticketmaster API
   NEXT_PUBLIC_TICKETMASTER_API_KEY=your_ticketmaster_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
city-pulse-local-events-explorer/
├── app/                    # Next.js app directory
│   ├── events/            # Events pages
│   ├── login/             # Authentication pages
│   ├── profile/            # User profile page
│   └── splash/            # Splash screen
├── lib/                   # Common bridging folder
│   ├── components/        # Reusable components
│   ├── config/            # Configuration files
│   ├── constants/         # Constants
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── public/                # Static assets
```

## 🔑 Key Features Implementation

### LocalStorage Data Persistence

All user data is saved locally using localStorage:

- **Authentication**: User auth state (`auth_user`)
- **Favorites**: Saved events (`saved_events`)
- **Preferences**: User preferences (`user_preferences`)
- **Recent Searches**: Search history (`recent_searches`)
- **Language**: Selected language (`app_language`)
- **Cities Cache**: Available cities (`available_cities`)

### Common Bridging Folder (`lib/`)

All business logic, hooks, and utilities are organized in the `lib/` folder:

- **Hooks**: `useAuth`, `useEventSearch`, `useFavorites`, `useCities`, `useLanguage`
- **Services**: `authService`, `eventService`, `userService`
- **Utils**: `storage`, `i18n`, `authHelpers`
- **Types**: TypeScript interfaces and types
- **Components**: Reusable UI components

### Firebase Authentication

Implemented authentication methods:

- Email/Password authentication
- Email Link (passwordless) authentication
- Google Sign-In
- User session persistence

## 🎨 Assumptions Made

1. **API Rate Limits**: The app handles Ticketmaster API rate limits gracefully with error messages
2. **Event Images**: Some events may not have images - placeholder icons are shown
3. **Location Data**: Event locations may be "TBD" - handled with fallback text
4. **User Display Names**: If no display name, email username is used
5. **RTL Support**: Arabic translations use placeholder text (as per requirements)
6. **Pagination**: Default page size is 12 events per page
7. **City Dropdown**: Cities are fetched from Ticketmaster API and cached for 24 hours

## 🌐 Live Link

*Add your deployed link here if hosting on Vercel/Netlify/etc.*

## 📱 Navigation Flow

1. **Splash Screen** (`/splash`) → Auto-redirects to Home after 2 seconds
2. **Home** (`/`) → Search events, view results
3. **Event Details** (`/events/[id]`) → View full event information
4. **Profile** (`/profile`) → View user info and saved events

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📦 Dependencies

- **Next.js 16.0.3** - React framework
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase** - Authentication
- **Ticketmaster Discovery API** - Event data

## 🗺️ Map Preview

The event detail page includes an interactive map preview when coordinates are available:
- Uses Leaflet library with OpenStreetMap tiles
- Shows event location with a marker
- Clickable marker with event title popup
- No API key required (uses free OpenStreetMap tiles)

## 🐛 Known Issues

- Biometric login not implemented (bonus feature)

## 📝 License

This project is created for assessment purposes.

## 👤 Author

Created as part of React Assessment
