// User roles
export type UserRole = 'driver' | 'parent' | 'admin';

// Authentication types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

// Student types
export interface Student {
  id: string;
  name: string;
  grade: string;
  pickupLocation: Location;
  parentId: string;
}

// Ride types
export type RideStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export interface Ride {
  id: string;
  driverId: string;
  studentIds: string[];
  startTime: Date;
  estimatedEndTime: Date;
  actualEndTime?: Date;
  status: RideStatus;
  pickupPoints: Location[];
  destinationLocation: Location;
  totalDistance: number; // in km
  totalDuration: number; // in minutes
  route?: Location[];
  notes?: string;
}

// Driver profile types
export interface DriverProfile extends AuthUser {
  vehicleInfo: {
    model: string;
    plate: string;
    color: string;
    capacity: number;
  };
  licenseNumber: string;
  totalRides: number;
  rating: number; // 1-5
  completedRides: number;
  cancelledRides: number;
  earnings?: number;
  currentLocation?: Location;
}

// Parent profile types
export interface ParentProfile extends AuthUser {
  children: Student[];
}

// Ride stats
export interface RideStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRating: number;
  totalKmDriven: number;
  totalHoursDriven: number;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  DriverApp: undefined;
  ParentApp: undefined;
};

export type DriverStackParamList = {
  Dashboard: undefined;
  Rides: undefined;
  Profile: undefined;
  RideDetail: { rideId: string };
  Settings: undefined;
};
export type ParentStackParamList = {
  Dashboard: undefined;
  Children: undefined;
  DriverTracking: { rideId: string };
  Profile: undefined;
  Settings: undefined;
};

