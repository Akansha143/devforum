# DevForum - Developer Community Platform

A modern, real-time developer community forum built with React, Vite, Tailwind CSS v4, and Firebase.

## Features

### Core Features
- **Authentication & Profiles**
  - Email/password signup and login
  - User profiles with avatars, bio, and skills
  - Profile editing functionality
  - Protected routes for authenticated features
  - Session persistence with localStorage

- **Real-Time Updates**
  - Live post updates using Firebase Firestore
  - Real-time comment streaming
  - Live like count updates
  - Online/offline user presence

- **Post System**
  - Create posts with title, content, and tags
  - Like/unlike posts with real-time count
  - Comment on posts
  - Bookmark posts for later
  - View counts
  - Filter by tags
  - Sort by newest, most popular, or most discussed

- **Advanced Features**
  - Draft saving with localStorage
  - Debounced search
  - Infinite scroll capability
  - Reputation/points system
  - Trending posts section
  - Tag-based filtering
  - Responsive design (mobile, tablet, desktop)
  - Dark mode toggle

### UI/UX
- Clean, modern SaaS-style interface
- Responsive navigation (desktop sidebar + mobile bottom nav)
- Skeleton loaders for smooth loading states
- Toast notifications for user actions
- Empty states with helpful messages
- Smooth animations and transitions

## Tech Stack

- **Frontend**: React 18.3 + Vite 5.4
- **Styling**: Tailwind CSS v4 (Vite plugin)
- **Routing**: React Router v6
- **Backend**: Firebase
  - Authentication
  - Firestore (real-time database)
  - Storage
- **State Management**: Context API with reducers
- **Form Validation**: Custom validators
- **Code Quality**: ESLint

## Project Structure
```
devforum/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   ├── post/            # Post-related components
│   │   └── profile/         # Profile components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # Firebase services
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Tailwind imports
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password
4. Create a Firestore database in production mode

### 2. Firestore Database Schema

**Collections:**

**users/**
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  bio: string,
  skills: array,
  reputation: number,
  bookmarks: array,
  online: boolean,
  lastSeen: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**posts/**
```javascript
{
  title: string,
  content: string,
  tags: array,
  authorId: string,
  authorName: string,
  authorPhotoURL: string,
  likes: array,
  likeCount: number,
  commentCount: number,
  views: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**posts/{postId}/comments/**
```javascript
{
  content: string,
  authorId: string,
  authorName: string,
  authorPhotoURL: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.authorId == request.auth.uid;
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update: if request.auth != null && resource.data.authorId == request.auth.uid;
        allow delete: if request.auth != null && resource.data.authorId == request.auth.uid;
      }
    }
  }
}
```

### 4. Firestore Indexes

Create these composite indexes in Firebase Console:

**Collection: posts**
- Fields: `createdAt` (Descending), `likeCount` (Descending)
- Query scope: Collection

## Environment Setup

1. **Copy environment template:**
```bash
   cp .env.example .env
```

2. **Add your Firebase credentials to `.env`:**
```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
```

## Installation & Running

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Install dependencies:**
```bash
   npm install
```

2. **Start development server:**
```bash
   npm run dev
```

3. **Build for production:**
```bash
   npm run build
```

4. **Preview production build:**
```bash
   npm run preview
```

The app will be available at `http://localhost:3000`

## Usage Guide

### Creating an Account
1. Click "Sign up" on the login page
2. Enter your display name, email, and password
3. You'll be automatically logged in and redirected to the home page

### Creating a Post
1. Click "New Post" in the navbar or bottom navigation
2. Enter a title (5-200 characters)
3. Write your content (minimum 10 characters)
4. Select relevant tags
5. Click "Publish Post" or "Save Draft"

### Interacting with Posts
- **Like**: Click the heart icon
- **Comment**: Open a post and write in the comment section
- **Bookmark**: Click the bookmark icon
- **Share**: Copy the post URL

### Searching Posts
1. Go to the Search page
2. Type keywords (searches titles, content, and tags)
3. Results appear in real-time with debouncing

### Profile Management
1. Click your avatar in the navbar
2. Select "Profile"
3. Click "Edit Profile" to update your information
4. Add skills (comma-separated)

## Customization

### Adding New Tags
Edit `src/utils/constants.js`:
```javascript
export const POST_TAGS = [
  'JavaScript',
  'YourNewTag',
  // Add more tags
];
```

### Changing Theme Colors
Tailwind CSS v4 uses CSS variables. Edit `src/index.css` to customize colors.

### Adding Features
1. Create new components in `src/components/`
2. Add services in `src/services/`
3. Create pages in `src/pages/`
4. Update routes in `src/App.jsx`

## Troubleshooting

### Firebase Connection Issues
- Verify `.env` variables are correct
- Check Firebase project settings
- Ensure Firestore is initialized

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Real-time Updates Not Working
- Check Firestore security rules
- Verify user is authenticated
- Check browser console for errors

## Performance Optimization

- Posts use real-time subscriptions (unsubscribe on unmount)
- Images are lazy-loaded
- Debounced search (500ms delay)
- Optimistic UI updates for likes/bookmarks
- Skeleton loaders for better perceived performance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this project for learning or building your own forum!

## Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## Contact

For questions or feedback, please open an issue on the repository.