import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Location as LocationType } from '../types';

interface UseLocationOptions {
  accuracy?: Location.Accuracy;
  timeInterval?: number;
  distanceInterval?: number;
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const { accuracy = Location.Accuracy.Balanced, timeInterval = 10000, distanceInterval = 0 } =
    options;

  const [location, setLocation] = useState<LocationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription;

    const startLocationTracking = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setError('Location permission denied');
          setIsLoading(false);
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({ accuracy });

        if (isMounted) {
          setLocation({
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
            altitude: initialLocation.coords.altitude ?? undefined,
            accuracy: initialLocation.coords.accuracy ?? undefined,
          });
        }

        // Start watching location
        subscription = await Location.watchPositionAsync(
          {
            accuracy,
            timeInterval,
            distanceInterval,
          },
          (newLocation) => {
            if (isMounted) {
              setLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                altitude: newLocation.coords.altitude ?? undefined,
                accuracy: newLocation.coords.accuracy ?? undefined,
              });
            }
          }
        );

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to get location');
          setIsLoading(false);
        }
      }
    };

    startLocationTracking();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
      }
    };
  }, [accuracy, timeInterval, distanceInterval]);

  return { location, error, isLoading };
};

export default useLocation;
