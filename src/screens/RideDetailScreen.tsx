import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';
import InfoRow from '../components/InfoRow';
import MapView from '../components/MapView';
import ScreenWrapper from '../components/ScreenWrapper';
import Section from '../components/Section';
import { COLORS, SIZES } from '../constants';
import { useDriver } from '../hooks/useDriver';
import { Ride } from '../types';
import { formatDateTime, formatDistance, formatDuration, getStatusColor } from '../utils/helpers';
import { mockCompletedRides, mockUpcomingRides } from '../utils/mockData';

interface RideDetailScreenProps {
  navigation: any;
  route: any;
}

const RideDetailScreen: React.FC<RideDetailScreenProps> = ({ navigation, route }) => {
  const { rideId } = route.params || {};
  const { activeRide, completeRide, cancelRide, currentLocation, profile } = useDriver();
  const [ride, setRide] = useState<Ride | null>(activeRide || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rideId && !ride) {
      const allRides = [...mockUpcomingRides, ...mockCompletedRides];
      const foundRide = allRides.find((r) => r.id === rideId);
      if (foundRide) {
        setRide(foundRide);
      }
    }
  }, [rideId, ride]);

  const handleCompleteRide = async () => {
    if (!ride) return;

    Alert.alert('Complete Ride', 'Are you sure you want to complete this ride?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Complete',
        onPress: async () => {
          setIsLoading(true);
          try {
            await completeRide(ride.id);
            Alert.alert('Success', 'Ride completed successfully!', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Dashboard'),
              },
            ]);
          } catch (err) {
            Alert.alert('Error', 'Failed to complete ride');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleCancelRide = async () => {
    if (!ride) return;

    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this ride?', [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: async () => {
          setIsLoading(true);
          try {
            await cancelRide(ride.id, 'Driver cancelled');
            Alert.alert('Success', 'Ride cancelled', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Dashboard'),
              },
            ]);
          } catch (err) {
            Alert.alert('Error', 'Failed to cancel ride');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  if (!ride) {
    return (
      <ScreenWrapper
        showSettingsButton
        onSettingsPress={() => navigation.navigate('Settings')}
      >
        <View style={styles.container}>
          <Header title="Ride Details" onBackPress={() => navigation.goBack()} />
          <EmptyState message="Ride not found" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      showSettingsButton
      onSettingsPress={() => navigation.navigate('Settings')}
    >
      <ScrollView style={styles.container}>
        <Header title="Ride Details" onBackPress={() => navigation.goBack()} />

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={[styles.statusValue, { color: getStatusColor(ride.status) }]}>
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </Text>
      </View>

      {/* Map View */}
      <Section title="Route Map">
        <View style={styles.mapContainer}>
          <MapView
            driverLocation={currentLocation || profile?.currentLocation || { latitude: 30.05, longitude: 31.01 }}
            pickupLocations={ride.pickupPoints}
            dropoffLocation={ride.destinationLocation}
          />
        </View>
      </Section>

      {/* Time Information */}
      <Section title="Time Information">
        <InfoRow label="Start Time" value={formatDateTime(ride.startTime)} />
        <InfoRow label="Estimated End Time" value={formatDateTime(ride.estimatedEndTime)} />
        {ride.actualEndTime && (
          <InfoRow label="Actual End Time" value={formatDateTime(ride.actualEndTime)} />
        )}
      </Section>

      {/* Route Information */}
      <Section title="Route Information">
        <InfoRow label="Distance" value={formatDistance(ride.totalDistance)} />
        <InfoRow label="Duration" value={formatDuration(ride.totalDuration)} />
        <InfoRow label="Pickup Points" value={ride.pickupPoints.length.toString()} />
      </Section>

      {/* Students */}
      <Section title={`Students (${ride.studentIds.length})`}>
        {ride.studentIds.map((studentId, index) => (
          <View key={studentId} style={styles.studentCard}>
            <Text style={styles.studentName}>Student {index + 1}</Text>
            <Text style={styles.studentId}>{studentId}</Text>
          </View>
        ))}
      </Section>

      {/* Notes */}
      {ride.notes && (
        <Section title="Notes">
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{ride.notes}</Text>
          </View>
        </Section>
      )}

      {/* Action Buttons */}
      {ride.status === 'in-progress' && (
        <Section>
          <Button
            title="Complete Ride"
            onPress={handleCompleteRide}
            variant="primary"
            loading={isLoading}
          />
          <View style={{ height: SIZES.md }} />
          <Button
            title="Cancel Ride"
            onPress={handleCancelRide}
            variant="danger"
            loading={isLoading}
          />
        </Section>
      )}

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
  statusCard: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    padding: SIZES.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 300,
    borderRadius: SIZES.md,
    overflow: 'hidden',
    marginBottom: SIZES.md,
  },
  studentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  studentId: {
    fontSize: 12,
    color: COLORS.white,
  },
  notesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.md,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  notesText: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
  },
});

export default RideDetailScreen;
