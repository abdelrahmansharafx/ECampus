// Colors - Matching grayscale gradient theme
export const COLORS = {
  // Primary colors matching the grayscale gradient
  primary: '#808080', // Medium gray - matches gradient midpoint
  primaryLight: '#B0B0B0', // Light gray
  primaryMid: '#606060', // Medium-dark gray
  primaryDark: '#404040', // Dark gray
  
  // Secondary colors
  secondary: '#707070', // Gray
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
  // Gradient colors
  gradient: {
    // Grayscale gradient (grey top-left to black bottom-right)
    grayscale: ['#808080', '#000000'], // Grey to pure black
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

// Storage Keys
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userRole: 'user_role',
  userProfile: 'user_profile',
};

export default {
  COLORS,
  SIZES,
  STORAGE_KEYS,
};
