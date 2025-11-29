import { Ride, DriverProfile, RideStats } from '../types';
import { mockDriverProfile, mockUpcomingRides, mockCompletedRides } from './mockData';

/**
 * Loads all ride-related data (profile, upcoming rides, completed rides)
 * This consolidates duplicate loading logic across screens
 */
export const loadRideData = () => {
  return {
    profile: mockDriverProfile,
    upcomingRides: mockUpcomingRides,
    completedRides: mockCompletedRides,
  };
};

/**
 * Calculates ride statistics from completed rides
 */
export const calculateRideStats = (completedRides: Ride[], profile: DriverProfile): RideStats => {
  const totalRides = completedRides.length;
  const completedCount = completedRides.length;
  const totalDistance = completedRides.reduce((sum, ride) => sum + ride.totalDistance, 0);
  const totalDuration = completedRides.reduce((sum, ride) => sum + ride.totalDuration, 0);

  return {
    totalRides,
    completedRides: completedCount,
    cancelledRides: 0,
    averageRating: profile.rating,
    totalKmDriven: totalDistance,
    totalHoursDriven: totalDuration / 60,
  };
};

