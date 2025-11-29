import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { Ride } from '../types';
import { formatDistance, formatDuration, formatTime, getStatusColor } from '../utils/helpers';

interface RideCardProps {
  ride: Ride;
  onPress: () => void;
  showStatus?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPress, showStatus = true }) => {
  const statusColor = useMemo(() => getStatusColor(ride.status), [ride.status]);
  const statusText = useMemo(
    () => ride.status.charAt(0).toUpperCase() + ride.status.slice(1),
    [ride.status]
  );

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
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Transparent white
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
    color: COLORS.white,
  },
  studentCount: {
    fontSize: 12,
    color: COLORS.white,
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
    color: COLORS.white,
    marginBottom: SIZES.xs / 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  notes: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: SIZES.md,
    fontStyle: 'italic',
  },
});

export default RideCard;
