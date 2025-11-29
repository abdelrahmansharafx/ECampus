import { Location } from '../types';

// Sheikh Zayed, Egypt boundaries (District 8 area)
export const SHEIKH_ZAYED_BOUNDS = {
  minLat: 30.0,
  maxLat: 30.1,
  minLng: 30.9,
  maxLng: 31.1,
};

// Default location in Sheikh Zayed District 8
export const DEFAULT_SHEIKH_ZAYED_LOCATION: Location = {
  latitude: 30.05,
  longitude: 31.01,
};

/**
 * Validates if a location is within Sheikh Zayed, Egypt boundaries
 */
export const isLocationInSheikhZayed = (location: Location): boolean => {
  return (
    location.latitude >= SHEIKH_ZAYED_BOUNDS.minLat &&
    location.latitude <= SHEIKH_ZAYED_BOUNDS.maxLat &&
    location.longitude >= SHEIKH_ZAYED_BOUNDS.minLng &&
    location.longitude <= SHEIKH_ZAYED_BOUNDS.maxLng
  );
};

/**
 * Clamps a location to stay within Sheikh Zayed boundaries
 */
export const clampLocationToSheikhZayed = (location: Location): Location => {
  return {
    latitude: Math.max(
      SHEIKH_ZAYED_BOUNDS.minLat,
      Math.min(SHEIKH_ZAYED_BOUNDS.maxLat, location.latitude)
    ),
    longitude: Math.max(
      SHEIKH_ZAYED_BOUNDS.minLng,
      Math.min(SHEIKH_ZAYED_BOUNDS.maxLng, location.longitude)
    ),
    accuracy: location.accuracy,
    altitude: location.altitude,
  };
};

/**
 * Ensures all locations in a ride are within Sheikh Zayed
 */
export const validateRideLocations = (pickupPoints: Location[], destination: Location): {
  pickupPoints: Location[];
  destination: Location;
} => {
  return {
    pickupPoints: pickupPoints.map(clampLocationToSheikhZayed),
    destination: clampLocationToSheikhZayed(destination),
  };
};

