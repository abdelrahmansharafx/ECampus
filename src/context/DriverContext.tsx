import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import { DriverProfile, Location, Ride, RideStatus } from '../types';

interface DriverContextType {
  profile: DriverProfile | null;
  setProfile: (profile: DriverProfile) => void;
  currentLocation: Location | null;
  setCurrentLocation: (location: Location) => void;
  activeRide: Ride | null;
  setActiveRide: (ride: Ride | null) => void;
  upcomingRides: Ride[];
  setUpcomingRides: (rides: Ride[]) => void;
  completedRides: Ride[];
  setCompletedRides: (rides: Ride[]) => void;
  updateRideStatus: (rideId: string, status: RideStatus) => Promise<void>;
  startRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
  cancelRide: (rideId: string, reason: string) => Promise<void>;
}

export const DriverContext = createContext<DriverContextType>({
  profile: null,
  setProfile: () => {},
  currentLocation: null,
  setCurrentLocation: () => {},
  activeRide: null,
  setActiveRide: () => {},
  upcomingRides: [],
  setUpcomingRides: () => {},
  completedRides: [],
  setCompletedRides: () => {},
  updateRideStatus: async () => {},
  startRide: async () => {},
  completeRide: async () => {},
  cancelRide: async () => {},
});

interface DriverProviderProps {
  children: React.ReactNode;
}

export const DriverProvider: React.FC<DriverProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [completedRides, setCompletedRides] = useState<Ride[]>([]);
  
  // Get real-time GPS location
  const { location: gpsLocation, error: locationError, isLoading: locationLoading } = useLocation({
    accuracy: 6,
    timeInterval: 10000,
    distanceInterval: 50,
    enabled: true,
  });

  // Update currentLocation when GPS location changes
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  
  useEffect(() => {
    if (gpsLocation) {
      // Only update if we have valid GPS coordinates
      if (gpsLocation.latitude && gpsLocation.longitude) {
        setCurrentLocation(gpsLocation);
        // Also update profile's currentLocation if profile exists
        setProfile((prevProfile) => {
          if (prevProfile) {
            const locationChanged = 
              !prevProfile.currentLocation ||
              prevProfile.currentLocation.latitude !== gpsLocation.latitude ||
              prevProfile.currentLocation.longitude !== gpsLocation.longitude;
            
            if (locationChanged) {
              return {
                ...prevProfile,
                currentLocation: gpsLocation,
              };
            }
          }
          return prevProfile;
        });
      }
    } else if (locationError) {
      // Log error but don't set default location
      console.log('Location error in DriverContext:', locationError);
    }
  }, [gpsLocation, locationError]);

  const updateRideStatus = useCallback(async (rideId: string, status: RideStatus) => {
    try {
      // TODO: Integrate with backend API
      // Example: const response = await fetch(`YOUR_API_ENDPOINT/rides/${rideId}`, { ... });
      // const updatedRide = await response.json();

      // Update locally for development
      const updatedRide = (activeRide?.id === rideId ? activeRide : 
        upcomingRides.find(r => r.id === rideId)) as Ride;
      
      if (updatedRide) {
        const rideWithNewStatus = { ...updatedRide, status };
        
        if (activeRide?.id === rideId) {
          setActiveRide(rideWithNewStatus);
        }

        setUpcomingRides((prevRides) =>
          prevRides.map((ride) => (ride.id === rideId ? rideWithNewStatus : ride))
        );
      }
    } catch (error) {
      throw error;
    }
  }, [activeRide, upcomingRides]);

  const startRide = useCallback(async (rideId: string) => {
    try {
      // TODO: Integrate with backend API
      // Example: const response = await fetch(`YOUR_API_ENDPOINT/rides/${rideId}/start`, { ... });
      // const updatedRide = await response.json();

      // Update locally for development
      const ride = upcomingRides.find((r) => r.id === rideId);
      if (ride) {
        const activeRideData = { ...ride, status: 'in-progress' as RideStatus };
        setActiveRide(activeRideData);
        setUpcomingRides((prevRides) => prevRides.filter((r) => r.id !== rideId));
      }
    } catch (error) {
      throw error;
    }
  }, [upcomingRides]);

  const completeRide = useCallback(async (rideId: string) => {
    try {
      // TODO: Integrate with backend API
      // Example: const response = await fetch(`YOUR_API_ENDPOINT/rides/${rideId}/complete`, { ... });
      // const completedRide = await response.json();

      // Update locally for development
      const ride = activeRide?.id === rideId ? activeRide : 
        upcomingRides.find((r) => r.id === rideId);
      
      if (ride) {
        const completedRide = { ...ride, status: 'completed' as RideStatus, actualEndTime: new Date() };
        setActiveRide(null);
        setCompletedRides((prevRides) => [completedRide, ...prevRides]);

        if (profile) {
          setProfile({
            ...profile,
            completedRides: profile.completedRides + 1,
            totalRides: profile.totalRides + 1,
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }, [activeRide, upcomingRides, profile]);

  const cancelRide = useCallback(async (rideId: string, reason: string) => {
    try {
      // TODO: Integrate with backend API
      // Example: const response = await fetch(`YOUR_API_ENDPOINT/rides/${rideId}/cancel`, { ... });

      // Update locally for development
      if (activeRide?.id === rideId) {
        setActiveRide(null);
      }

      setUpcomingRides((prevRides) => prevRides.filter((ride) => ride.id !== rideId));

      if (profile) {
        setProfile({
          ...profile,
          cancelledRides: profile.cancelledRides + 1,
          totalRides: profile.totalRides + 1,
        });
      }
    } catch (error) {
      throw error;
    }
  }, [activeRide?.id, profile]);

  const value = {
    profile,
    setProfile,
    currentLocation,
    setCurrentLocation,
    activeRide,
    setActiveRide,
    upcomingRides,
    setUpcomingRides,
    completedRides,
    setCompletedRides,
    updateRideStatus,
    startRide,
    completeRide,
    cancelRide,
  };

  return (
    <DriverContext.Provider value={value}>
      {children}
    </DriverContext.Provider>
  );
};

export default DriverContext;
