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
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    backgroundColor: COLORS.gray[50],
    borderRadius: SIZES.md,
    padding: SIZES.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
});

export default RideStatsComponent;
