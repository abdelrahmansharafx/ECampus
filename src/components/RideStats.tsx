import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RideStats } from '../types';
import { COLORS, SIZES } from '../constants';
import { roundTo } from '../utils/helpers';

interface RideStatsProps {
  stats: RideStats;
}

const RideStatsComponent: React.FC<RideStatsProps> = ({ stats }) => {
  const completionRate = stats.totalRides > 0 
    ? roundTo((stats.completedRides / stats.totalRides) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalRides}</Text>
          <Text style={styles.statLabel}>Total Rides</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completedRides}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.danger }]}>
            {stats.cancelledRides}
          </Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.detailedStats}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Completion Rate</Text>
          <Text style={styles.detailValue}>{completionRate}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Distance Driven</Text>
          <Text style={styles.detailValue}>{stats.totalKmDriven.toFixed(1)} km</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Hours Driven</Text>
          <Text style={styles.detailValue}>{stats.totalHoursDriven.toFixed(1)} h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent white matching gradient
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: SIZES.xs,
    textAlign: 'center',
  },
  detailedStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Transparent white
    borderRadius: SIZES.md,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.white,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default RideStatsComponent;
