import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDriver } from '../hooks/useDriver';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import { Ride } from '../types';
import { mockUpcomingRides, mockCompletedRides } from '../utils/mockData';
import { formatDistance, formatDuration, formatDateTime } from '../utils/helpers';

interface RideDetailScreenProps {
  navigation: any;
  route: any;
}

const RideDetailScreen: React.FC<RideDetailScreenProps> = ({ navigation, route }) => {
  const { rideId } = route.params || {};
  const { activeRide, completeRide, cancelRide } = useDriver();
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
            console.error('Complete ride error:', err);
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
            console.error('Cancel ride error:', err);
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
      <View style={styles.container}>
        <Header title="Ride Details" onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ride not found</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="Ride Details" onBackPress={() => navigation.goBack()} />

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={[styles.statusValue, { color: getStatusColor(ride.status) }]}>
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </Text>
      </View>

      {/* Time Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Start Time</Text>
          <Text style={styles.value}>{formatDateTime(ride.startTime)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estimated End Time</Text>
          <Text style={styles.value}>{formatDateTime(ride.estimatedEndTime)}</Text>
        </View>

        {ride.actualEndTime && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Actual End Time</Text>
            <Text style={styles.value}>{formatDateTime(ride.actualEndTime)}</Text>
          </View>
        )}
      </View>

      {/* Route Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Route Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Distance</Text>
          <Text style={styles.value}>{formatDistance(ride.totalDistance)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{formatDuration(ride.totalDuration)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Pickup Points</Text>
          <Text style={styles.value}>{ride.pickupPoints.length}</Text>
        </View>
      </View>

      {/* Students */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Students ({ride.studentIds.length})</Text>

        {ride.studentIds.map((studentId, index) => (
          <View key={studentId} style={styles.studentCard}>
            <Text style={styles.studentName}>Student {index + 1}</Text>
            <Text style={styles.studentId}>{studentId}</Text>
          </View>
        ))}
      </View>

      {/* Notes */}
      {ride.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{ride.notes}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {ride.status === 'in-progress' && (
        <View style={styles.section}>
          <Button
            title="Complete Ride"
            onPress={handleCompleteRide}
            variant="primary"
            loading={isLoading}
          />
          <Button
            title="Cancel Ride"
            onPress={handleCancelRide}
            variant="danger"
            loading={isLoading}
          />
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={{ height: SIZES.xl }} />
    </ScrollView>
  );
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return COLORS.success;
    case 'in-progress':
      return COLORS.primary;
    case 'cancelled':
      return COLORS.danger;
    default:
      return COLORS.secondary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[500],
  },
  statusCard: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: SIZES.xs,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  label: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  studentCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.xs,
  },
  studentId: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  notesCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  notesText: {
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 20,
  },
});

export default RideDetailScreen;
