// Colors
export const COLORS = {
  primary: '#2563EB',
  secondary: '#64748B',
  success: '#16A34A',
  warning: '#EA580C',
  danger: '#DC2626',
  light: '#F8FAFC',
  dark: '#0F172A',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Sizes
export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
  },
};

// API Configuration
export const API_CONFIG = {
  baseURL: 'https://api.schoolbusapp.com',
  timeout: 30000,
};

// Map Configuration
export const MAP_CONFIG = {
  defaultCenter: { latitude: 40.7128, longitude: -74.006 },
  defaultZoom: 15,
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '',
};

// Storage Keys
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userRole: 'user_role',
  userId: 'user_id',
  userProfile: 'user_profile',
  lastLocation: 'last_location',
};

// Routes
export const ROUTES = {
  DRIVER: {
    DASHBOARD: 'Dashboard',
    RIDES: 'Rides',
    PROFILE: 'Profile',
    RIDE_DETAIL: 'RideDetail',
    SETTINGS: 'Settings',
  },
  PARENT: {
    DASHBOARD: 'Dashboard',
    CHILDREN: 'Children',
    DRIVER_TRACKING: 'DriverTracking',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
  },
};

// Ride statuses
export const RIDE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Time constants
export const TIME_CONSTANTS = {
  LOCATION_UPDATE_INTERVAL: 10000, // 10 seconds
  RIDE_CHECK_INTERVAL: 30000, // 30 seconds
  API_RETRY_COUNT: 3,
  API_RETRY_DELAY: 1000, // 1 second
};

export default {
  COLORS,
  SIZES,
  TYPOGRAPHY,
  API_CONFIG,
  MAP_CONFIG,
  STORAGE_KEYS,
  ROUTES,
  RIDE_STATUS,
  TIME_CONSTANTS,
};
