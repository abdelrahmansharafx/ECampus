# School Bus Driver App

A React Native application built with Expo for managing school bus rides. The app supports multiple user roles (driver, parent, admin) with comprehensive features for ride management, location tracking, and real-time updates.

## Features

### Driver Features
- **Dashboard**: View active rides and upcoming schedules
- **Ride Management**: Accept, start, and complete rides
- **Real-time Location Tracking**: Track driver location during rides
- **Ride History**: View completed and cancelled rides
- **Driver Profile**: Display driver information, vehicle details, and statistics
- **Performance Metrics**: Track total rides, completion rate, ratings, and distance driven
- **Settings**: Manage preferences and app settings

### Parent Features (Future)
- Track driver location in real-time
- View children's pickup/dropoff status
- Receive notifications about ride updates
- View historical ride data

## Project Structure

```
school-bus-driver/
├── src/
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── RidesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── RideDetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/         # Reusable components
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── RideCard.tsx
│   │   └── RideStats.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDriver.ts
│   │   └── useLocation.ts
│   ├── context/            # Global state management
│   │   ├── AuthContext.tsx
│   │   └── DriverContext.tsx
│   ├── navigation/         # Navigation setup
│   │   └── RootNavigator.tsx
│   ├── services/           # API services (future)
│   ├── constants/          # App constants
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── helpers.ts
│   │   └── mockData.ts
│   └── types/              # TypeScript type definitions
│       └── index.ts
├── assets/                 # Images and static assets
├── .eslintrc.json         # ESLint configuration
├── .prettierrc.json       # Prettier configuration
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── index.tsx              # App entry point
```

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
  - Bottom tabs for main navigation
  - Native stack for screen transitions
- **Async Storage**: Local data persistence
- **Expo Location**: GPS location tracking
- **Expo Maps**: Map integration (MapLibre)
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android development) or Xcode (for iOS development)

### Setup

1. **Clone the repository**
   ```bash
   cd school-bus-driver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   EXPO_PUBLIC_API_URL=https://api.schoolbusapp.com
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device**
   - **Android**: Press `a` to open Android emulator
   - **iOS**: Press `i` to open iOS simulator (macOS only)
   - **Web**: Press `w` to open web browser
   - **Expo App**: Scan QR code with Expo Go app

## Available Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web

# Lint code
npm run lint

# Format code
npm run format

# Reset project (clear cache)
npm run reset-project
```

## API Integration

The app is structured to easily integrate with a backend API. Mock data is used for development. Replace API calls in these files:

- `src/context/AuthContext.tsx` - Authentication endpoints
- `src/context/DriverContext.tsx` - Ride management endpoints
- `src/screens/HomeScreen.tsx` - Data loading

Example API endpoints needed:
```
POST   /auth/login
POST   /auth/register
PUT    /users/:id
GET    /rides
POST   /rides/:id/start
POST   /rides/:id/complete
POST   /rides/:id/cancel
GET    /rides/:id
```

## State Management

### AuthContext
Manages user authentication and profile data
- Login/logout functionality
- User profile management
- Auth token storage

### DriverContext
Manages driver-specific data
- Active rides
- Upcoming rides
- Completed rides
- Driver profile
- Current location
- Ride operations (start, complete, cancel)

## Custom Hooks

### useAuth()
Access authentication context
```typescript
const { user, isSignedIn, login, logout } = useAuth();
```

### useDriver()
Access driver context
```typescript
const { profile, activeRide, startRide, completeRide } = useDriver();
```

### useLocation()
Get real-time GPS location
```typescript
const { location, error, isLoading } = useLocation({
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 10000,
  distanceInterval: 0,
});
```

## Utility Functions

Common utilities in `src/utils/helpers.ts`:
- `calculateDistance()` - Calculate distance between coordinates
- `formatDistance()` - Format distance to readable string
- `formatDuration()` - Format time duration
- `calculateETA()` - Calculate estimated time of arrival
- `formatDate()` / `formatTime()` - Date/time formatting
- `isValidEmail()` / `isValidPhone()` - Input validation
- `getInitials()` - Get name initials

## Code Style

This project uses:
- **ESLint**: Enforces code quality rules
- **Prettier**: Automatic code formatting

Run linting and formatting:
```bash
npm run lint      # Check for errors
npm run format    # Auto-format code
```

## Extending the App

### Adding New Screens

1. Create a new screen in `src/screens/`
2. Add navigation route in `src/navigation/RootNavigator.tsx`
3. Add navigation parameters in `src/types/index.ts`

### Adding New Context

1. Create context in `src/context/`
2. Create provider wrapper component
3. Wrap app with provider in `index.tsx`
4. Create custom hook in `src/hooks/`

### Adding New API Endpoints

1. Add types in `src/types/index.ts`
2. Create service function in `src/services/`
3. Call from context or components
4. Handle errors and loading states

## Known Limitations

- Map integration requires MapBox API key
- Location services require device permissions
- Some features require API backend implementation
- Mock data is used for development

## Future Enhancements

- [ ] Parent app interface
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Offline mode
- [ ] Multiple language support
- [ ] Dark mode theme
- [ ] Video call support

## Support

For issues and feature requests, please contact the development team.

## License

Proprietary - All rights reserved
