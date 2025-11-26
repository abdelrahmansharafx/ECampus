import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useDriver } from '../hooks/useDriver';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';
import RideCard from '../components/RideCard';
import Button from '../components/Button';
import { mockUpcomingRides, mockCompletedRides } from '../utils/mockData';

interface RidesScreenProps {
  navigation: any;
}

type RideTab = 'upcoming' | 'completed';

const RidesScreen: React.FC<RidesScreenProps> = ({ navigation }) => {
  const { setUpcomingRides, setCompletedRides, startRide } = useDriver();
  const [activeTab, setActiveTab] = useState<RideTab>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [localUpcomingRides, setLocalUpcomingRides] = useState(mockUpcomingRides);
  const [localCompletedRides, setLocalCompletedRides] = useState(mockCompletedRides);

  useEffect(() => {
    const initLoad = async () => {
      try {
        // TODO: Load real data from API
        setUpcomingRides(mockUpcomingRides);
        setCompletedRides(mockCompletedRides);
        setLocalUpcomingRides(mockUpcomingRides);
        setLocalCompletedRides(mockCompletedRides);
      } catch (error) {
        console.error('Failed to load rides:', error);
      }
    };

    initLoad();
  }, [setUpcomingRides, setCompletedRides]);

  const loadRides = async () => {
    try {
      // TODO: Load real data from API
      setUpcomingRides(mockUpcomingRides);
      setCompletedRides(mockCompletedRides);
      setLocalUpcomingRides(mockUpcomingRides);
      setLocalCompletedRides(mockCompletedRides);
    } catch (error) {
      console.error('Failed to load rides:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadRides();
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartRide = async (rideId: string) => {
    try {
      await startRide(rideId);
      setLocalUpcomingRides((prev) => prev.filter((r) => r.id !== rideId));
      navigation.navigate('RideDetail', { rideId });
    } catch (error) {
      console.error('Failed to start ride:', error);
    }
  };

  const displayRides = activeTab === 'upcoming' ? localUpcomingRides : localCompletedRides;

  return (
    <View style={styles.container}>
      <Header
        title="Rides"
        onBackPress={() => navigation.goBack()}
      />

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          <View
            style={[
              styles.tab,
              activeTab === 'upcoming' && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.activeTabText,
              ]}
              onPress={() => setActiveTab('upcoming')}
            >
              Upcoming ({localUpcomingRides.length})
            </Text>
          </View>
          <View
            style={[
              styles.tab,
              activeTab === 'completed' && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && styles.activeTabText,
              ]}
              onPress={() => setActiveTab('completed')}
            >
              Completed ({localCompletedRides.length})
            </Text>
          </View>
        </View>
      </View>

      {/* Rides List */}
      <FlatList
        data={displayRides}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {activeTab} rides
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.rideWrapper}>
            <RideCard
              ride={item}
              onPress={() => {
                if (activeTab === 'upcoming') {
                  navigation.navigate('RideDetail', { rideId: item.id });
                }
              }}
            />
            {activeTab === 'upcoming' && (
              <View style={styles.actionButtons}>
                <Button
                  title="Start Ride"
                  onPress={() => handleStartRide(item.id)}
                  variant="primary"
                />
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  tabContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  tabs: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray[600],
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  rideWrapper: {
    marginBottom: SIZES.md,
  },
  actionButtons: {
    marginTop: SIZES.sm,
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
});

export default RidesScreen;
