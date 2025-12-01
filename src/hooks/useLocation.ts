import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Location as LocationType } from '../types';

interface UseLocationOptions {
  accuracy?: number;
  timeInterval?: number;
  distanceInterval?: number;
  enabled?: boolean;
}

interface UseLocationResult {
  location: LocationType | null;
  error: string | null;
  isLoading: boolean;
}

// Sheikh Zayed, Egypt boundaries
const SHEIKH_ZAYED_BOUNDS = {
  minLat: 30.0,
  maxLat: 30.1,
  minLng: 30.9,
  maxLng: 31.1,
};

const DEFAULT_LOCATION: LocationType = {
  latitude: 30.05,
  longitude: 31.01,
};

export const useLocation = (
  options: UseLocationOptions = {}
): UseLocationResult => {
  const {
    accuracy = 6,
    timeInterval = 10000,
    distanceInterval = 50,
    enabled = true,
  } = options;

  const [location, setLocation] = useState<LocationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let subscription: Location.LocationSubscription | null = null;

    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setIsLoading(false);
          setLocation(DEFAULT_LOCATION);
          return;
        }

        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          setError('Location services are disabled');
          setIsLoading(false);
          setLocation(DEFAULT_LOCATION);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: accuracy as Location.Accuracy,
        });

        const locationData: LocationType = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy || undefined,
          altitude: currentLocation.coords.altitude || undefined,
        };

        // Don't clamp driver's GPS location - use actual coordinates
        setLocation(locationData);
        setError(null);
        setIsLoading(false);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: accuracy as Location.Accuracy,
            timeInterval,
            distanceInterval,
          },
          (newLocation) => {
            const locationData: LocationType = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              accuracy: newLocation.coords.accuracy || undefined,
              altitude: newLocation.coords.altitude || undefined,
            };

            // Don't clamp driver's GPS location - use actual coordinates
            setLocation(locationData);
            setError(null);
          }
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to get location';
        setError(errorMessage);
        setIsLoading(false);
        // Don't set default location on error - keep it null so user knows location isn't available
        console.log('Location error:', errorMessage);
      }
    };

    requestLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [accuracy, timeInterval, distanceInterval, enabled]);

  return { location, error, isLoading };
};

export default useLocation;

