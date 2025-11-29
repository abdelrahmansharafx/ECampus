import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useDriver } from '../hooks/useDriver';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import RideStats from '../components/RideStats';
import ScreenWrapper from '../components/ScreenWrapper';
import Section from '../components/Section';
import InfoCard from '../components/InfoCard';
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
    // TODO: Integrate with backend API
    // Example: const response = await fetch('YOUR_API_ENDPOINT/driver/profile');
    // const profileData = await response.json();
    // setProfile(profileData);

    // Currently using mock data for development
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
  }, [setProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will automatically switch to Auth screen via RootNavigator
      // based on isSignedIn state change
    } catch (error) {
      // Silently handle logout errors
    }
  };

  return (
    <ScreenWrapper
      showSettingsButton
      onSettingsPress={() => navigation.navigate('Settings')}
    >
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
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color={COLORS.warning} />
            <Text style={styles.rating}>{profile?.rating || 0}</Text>
          </View>
          <Text style={styles.ratingText}>({mockCompletedRides.length} rides)</Text>
        </View>
      </View>

      {/* Contact Information */}
      <Section title="Contact Information">
        <InfoCard label="Email" value={profile?.email || user?.email || ''} />
        <InfoCard label="Phone" value={profile?.phone || user?.phone || ''} />
      </Section>

      {/* Vehicle Information */}
      <Section title="Vehicle Information">
        <InfoCard label="Model" value={profile?.vehicleInfo?.model || ''} />
        <InfoCard label="License Plate" value={profile?.vehicleInfo?.plate || ''} />
        <InfoCard label="Color" value={profile?.vehicleInfo?.color || ''} />
        <InfoCard label="Capacity" value={`${profile?.vehicleInfo?.capacity || 0} passengers`} />
      </Section>

      {/* Driver Information */}
      <Section title="Driver Information">
        <InfoCard label="License Number" value={profile?.licenseNumber || ''} />
      </Section>

      {/* Stats */}
      {stats && <RideStats stats={stats} />}

      {/* Action Buttons */}
      <Section>
        <Button
          title="Edit Profile"
          onPress={() => navigation.navigate('Settings')}
          variant="primary"
        />
        <View style={{ height: SIZES.md }} />
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
        />
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent white matching gradient
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.white,
  },
});

export default ProfileScreen;
