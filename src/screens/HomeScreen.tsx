import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useDriver } from '../hooks/useDriver';
import { COLORS, SIZES } from '../constants';
import Button from '../components/Button';
import RideCard from '../components/RideCard';
import RideStats from '../components/RideStats';
import { mockDriverProfile, mockUpcomingRides, mockCompletedRides } from '../utils/mockData';
import { Ride, RideStats as RideStatsType } from '../types';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { profile, setProfile, activeRide, setActiveRide, setUpcomingRides, setCompletedRides } =
    useDriver();

  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<RideStatsType | null>(null);
  const [upcomingRides, setLocalUpcomingRides] = useState<Ride[]>([]);

  useEffect(() => {
    const initLoad = async () => {
      try {
        // TODO: Load real data from API
        setProfile(mockDriverProfile);
        setUpcomingRides(mockUpcomingRides);
        setCompletedRides(mockCompletedRides);
        setLocalUpcomingRides(mockUpcomingRides);

        // Calculate stats
        const totalRides = mockUpcomingRides.length + mockCompletedRides.length;
        const completedRides = mockCompletedRides.length;
        const cancelledRides = 2; // Mock value
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
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    initLoad();
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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome, {user?.name || 'Driver'}!</Text>
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
          <RideCard ride={activeRide} onPress={() => navigation.navigate('RideDetail', {})} />
        </View>
      ) : (
        <View style={styles.noActiveRide}>
          <Text style={styles.noActiveRideText}>No active rides</Text>
          <Button title="Check Available Rides" onPress={() => navigation.navigate('Rides')} />
        </View>
      )}

      {/* Stats Section */}
      {stats && <RideStats stats={stats} />}

      {/* Upcoming Rides Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Rides</Text>
          <Text style={styles.viewAll} onPress={() => navigation.navigate('Rides')}>
            View All
          </Text>
        </View>

        {upcomingRides.length > 0 ? (
          upcomingRides.slice(0, 2).map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onPress={() => handleStartRide(ride.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No upcoming rides scheduled</Text>
        )}
      </View>

      {/* Profile Card */}
      <View style={styles.section}>
        <View style={styles.profileCard}>
          <View>
            <Text style={styles.profileName}>{profile?.name || 'Driver Name'}</Text>
            <Text style={styles.profileRating}>
              Rating: {profile?.rating || 0} ⭐
            </Text>
            <Text style={styles.profileVehicle}>
              {profile?.vehicleInfo.model} - {profile?.vehicleInfo.plate}
            </Text>
          </View>
          <Button
            title="Profile"
            size="small"
            onPress={handleViewProfile}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.buttonGroup}>
          <Button
            title="Start Ride"
            onPress={() => navigation.navigate('Rides')}
            variant="primary"
          />
          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            variant="secondary"
          />
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: SIZES.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  welcomeSection: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: SIZES.xs,
  },
  activeRideCard: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  activeRideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  noActiveRide: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  noActiveRideText: {
    fontSize: 16,
    color: COLORS.gray[600],
    marginBottom: SIZES.md,
  },
  section: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  viewAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray[500],
    textAlign: 'center',
    paddingVertical: SIZES.lg,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  profileRating: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginTop: SIZES.xs,
  },
  profileVehicle: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: SIZES.xs,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
});

export default HomeScreen;
