import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ride } from '../types';
import { COLORS, SIZES } from '../constants';
import { formatTime, formatDistance, formatDuration } from '../utils/helpers';

interface RideCardProps {
  ride: Ride;
  onPress: () => void;
  showStatus?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPress, showStatus = true }) => {
  const statusColor =
    ride.status === 'completed'
      ? COLORS.success
      : ride.status === 'in-progress'
        ? COLORS.primary
        : ride.status === 'cancelled'
          ? COLORS.danger
          : COLORS.secondary;

  const statusText = ride.status.charAt(0).toUpperCase() + ride.status.slice(1);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View>
          <Text style={styles.time}>
            {formatTime(ride.startTime)}
            {ride.estimatedEndTime && ` - ${formatTime(ride.estimatedEndTime)}`}
          </Text>
          <Text style={styles.studentCount}>{ride.studentIds.length} student(s)</Text>
        </View>
        {showStatus && (
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Distance</Text>
          <Text style={styles.detailValue}>{formatDistance(ride.totalDistance)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{formatDuration(ride.totalDuration)}</Text>
        </View>
      </View>

      {ride.notes && <Text style={styles.notes}>{ride.notes}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.md,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  studentCount: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: SIZES.xs,
  },
  statusBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: SIZES.xs / 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  notes: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginTop: SIZES.md,
    fontStyle: 'italic',
  },
});

export default RideCard;
