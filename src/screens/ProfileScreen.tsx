import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useDriver } from '../hooks/useDriver';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import RideStats from '../components/RideStats';
import { mockDriverProfile, mockCompletedRides } from '../utils/mockData';
import { RideStats as RideStatsType } from '../types';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { profile, setProfile } = useDriver();
  const [stats, setStats] = useState<RideStatsType | null>(null);

  useEffect(() => {
    const initLoad = () => {
      // TODO: Load real data from API
      setProfile(mockDriverProfile);

      const totalDistance = mockCompletedRides.reduce((sum, ride) => sum + ride.totalDistance, 0);
      const totalDuration = mockCompletedRides.reduce((sum, ride) => sum + ride.totalDuration, 0);

      setStats({
        totalRides: mockCompletedRides.length,
        completedRides: mockCompletedRides.length,
        cancelledRides: 0,
        averageRating: mockDriverProfile.rating,
        totalKmDriven: totalDistance,
        totalHoursDriven: totalDuration / 60,
      });
    };

    initLoad();
  }, [setProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Profile" onBackPress={() => navigation.goBack()} />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {profile?.profileImage ? (
            <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'D'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{profile?.name || user?.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{profile?.rating || 0}⭐</Text>
          <Text style={styles.ratingText}>({mockCompletedRides.length} rides)</Text>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{profile?.email || user?.email}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{profile?.phone || user?.phone}</Text>
        </View>
      </View>

      {/* Vehicle Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Model</Text>
          <Text style={styles.infoValue}>{profile?.vehicleInfo.model}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>License Plate</Text>
          <Text style={styles.infoValue}>{profile?.vehicleInfo.plate}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Color</Text>
          <Text style={styles.infoValue}>{profile?.vehicleInfo.color}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Capacity</Text>
          <Text style={styles.infoValue}>{profile?.vehicleInfo.capacity} passengers</Text>
        </View>
      </View>

      {/* Driver Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Driver Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>License Number</Text>
          <Text style={styles.infoValue}>{profile?.licenseNumber}</Text>
        </View>
      </View>

      {/* Stats */}
      {stats && <RideStats stats={stats} />}

      {/* Action Buttons */}
      <View style={styles.section}>
        <Button
          title="Edit Profile"
          onPress={() => navigation.navigate('Settings')}
          variant="primary"
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
        />
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  avatarContainer: {
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  section: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.md,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: SIZES.xs,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
});

export default ProfileScreen;
