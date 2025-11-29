import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useDriver } from '../hooks/useDriver';
import { COLORS, SIZES } from '../constants';
import Button from '../components/Button';
import RideCard from '../components/RideCard';
import RideStats from '../components/RideStats';
import MapView from '../components/MapView';
import ScreenWrapper from '../components/ScreenWrapper';
import Section from '../components/Section';
import EmptyState from '../components/EmptyState';
import { mockDriverProfile, mockUpcomingRides, mockCompletedRides } from '../utils/mockData';
import { Ride, RideStats as RideStatsType } from '../types';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { profile, setProfile, activeRide, setActiveRide, setUpcomingRides, setCompletedRides, currentLocation } =
    useDriver();

  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<RideStatsType | null>(null);
  const [upcomingRides, setLocalUpcomingRides] = useState<Ride[]>([]);

  useEffect(() => {
    // TODO: Integrate with backend API
    // Example: const response = await fetch('YOUR_API_ENDPOINT/driver/dashboard');
    // const data = await response.json();
    // setProfile(data.profile);
    // setUpcomingRides(data.upcomingRides);
    // setCompletedRides(data.completedRides);

    // Currently using mock data for development
    setProfile(mockDriverProfile);
    setUpcomingRides(mockUpcomingRides);
    setCompletedRides(mockCompletedRides);
    setLocalUpcomingRides(mockUpcomingRides);

    // Calculate stats
    const totalRides = mockUpcomingRides.length + mockCompletedRides.length;
    const completedRides = mockCompletedRides.length;
    const cancelledRides = 2;
    const totalDistance = mockCompletedRides.reduce((sum, ride) => sum + ride.totalDistance, 0);
    const totalDuration = mockCompletedRides.reduce((sum, ride) => sum + ride.totalDuration, 0);

    setStats({
      totalRides,
      completedRides,
      cancelledRides,
      averageRating: mockDriverProfile.rating,
      totalKmDriven: totalDistance,
      totalHoursDriven: totalDuration / 60,
    });
  }, [setProfile, setUpcomingRides, setCompletedRides]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setProfile(mockDriverProfile);
      setUpcomingRides(mockUpcomingRides);
      setCompletedRides(mockCompletedRides);
      setLocalUpcomingRides(mockUpcomingRides);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartRide = (rideId: string) => {
    const ride = upcomingRides.find((r) => r.id === rideId);
    if (ride) {
      setActiveRide({ ...ride, status: 'in-progress' });
      navigation.navigate('RideDetail', { rideId });
    }
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <ScreenWrapper
      showSettingsButton
      onSettingsPress={() => navigation.navigate('Settings')}
    >
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeText}>Welcome, {user?.name || 'Driver'}!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileIconButton}>
            <Ionicons name="person-circle-outline" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Current Status Card */}
      {activeRide ? (
        <View style={styles.activeRideCard}>
          <Text style={styles.activeRideTitle}>Active Ride</Text>
          {currentLocation || profile?.currentLocation ? (
            <View style={styles.mapContainer}>
              <MapView
                driverLocation={currentLocation || profile?.currentLocation!}
                pickupLocations={activeRide.pickupPoints}
                dropoffLocation={activeRide.destinationLocation}
              />
            </View>
          ) : (
            <View style={styles.mapContainer}>
              <Text style={styles.locationErrorText}>
                Waiting for GPS location... Please ensure location permission is granted.
              </Text>
            </View>
          )}
          <RideCard ride={activeRide} onPress={() => navigation.navigate('RideDetail', { rideId: activeRide.id })} />
        </View>
      ) : (
        <View style={styles.noActiveRide}>
          <Text style={styles.noActiveRideText}>No active rides</Text>
          <View style={styles.buttonWrapper}>
            <Button title="Check Available Rides" onPress={() => navigation.navigate('Rides')} />
          </View>
        </View>
      )}

      {/* Stats Section */}
      {stats && <RideStats stats={stats} />}

      {/* Upcoming Rides Section */}
      <Section
        title="Upcoming Rides"
        headerRight={
          <Text style={styles.viewAll} onPress={() => navigation.navigate('Rides')}>
            View All
          </Text>
        }
      >
        {upcomingRides.length > 0 ? (
          upcomingRides.slice(0, 2).map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onPress={() => handleStartRide(ride.id)}
            />
          ))
        ) : (
          <EmptyState message="No upcoming rides scheduled" />
        )}
      </Section>

      {/* Bottom Spacing */}
      <View style={{ height: SIZES.xl }} />
    </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.md,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  profileIconButton: {
    padding: SIZES.xs,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: SIZES.xs,
  },
  activeRideCard: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  activeRideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  mapContainer: {
    height: 300,
    marginBottom: SIZES.md,
    borderRadius: SIZES.md,
    overflow: 'hidden',
  },
  noActiveRide: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  noActiveRideText: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: SIZES.md,
  },
  buttonWrapper: {
    width: '80%',
    alignSelf: 'center',
  },
  viewAll: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  locationErrorText: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    padding: SIZES.md,
  },
});

export default HomeScreen;
