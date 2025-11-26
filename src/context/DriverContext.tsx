import React, { createContext, useCallback, useState } from 'react';
import { Location, Ride, RideStatus, DriverProfile } from '../types';

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
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [completedRides, setCompletedRides] = useState<Ride[]>([]);

  const updateRideStatus = useCallback(async (rideId: string, status: RideStatus) => {
    try {
      // TODO: Call your API endpoint
      const response = await fetch(`https://api.schoolbusapp.com/rides/${rideId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ride status');
      }

      const updatedRide = await response.json();

      if (activeRide?.id === rideId) {
        setActiveRide(updatedRide);
      }

      setUpcomingRides((prevRides) =>
        prevRides.map((ride) => (ride.id === rideId ? updatedRide : ride))
      );
    } catch (error) {
      console.error('Update ride status error:', error);
      throw error;
    }
  }, [activeRide?.id]);

  const startRide = useCallback(async (rideId: string) => {
    try {
      // TODO: Call your API endpoint
      const response = await fetch(
        `https://api.schoolbusapp.com/rides/${rideId}/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start ride');
      }

      const updatedRide = await response.json();
      setActiveRide(updatedRide);
      setUpcomingRides((prevRides) => prevRides.filter((ride) => ride.id !== rideId));
    } catch (error) {
      console.error('Start ride error:', error);
      throw error;
    }
  }, []);

  const completeRide = useCallback(async (rideId: string) => {
    try {
      // TODO: Call your API endpoint
      const response = await fetch(
        `https://api.schoolbusapp.com/rides/${rideId}/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to complete ride');
      }

      const completedRide = await response.json();
      setActiveRide(null);
      setCompletedRides((prevRides) => [completedRide, ...prevRides]);

      if (profile) {
        setProfile({
          ...profile,
          completedRides: profile.completedRides + 1,
          totalRides: profile.totalRides + 1,
        });
      }
    } catch (error) {
      console.error('Complete ride error:', error);
      throw error;
    }
  }, [profile]);

  const cancelRide = useCallback(async (rideId: string, reason: string) => {
    try {
      // TODO: Call your API endpoint
      const response = await fetch(
        `https://api.schoolbusapp.com/rides/${rideId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel ride');
      }

      await response.json();

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
      console.error('Cancel ride error:', error);
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
