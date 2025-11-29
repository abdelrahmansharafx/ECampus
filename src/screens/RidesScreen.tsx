import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useDriver } from '../hooks/useDriver';
import { SIZES } from '../constants';
import Header from '../components/Header';
import RideCard from '../components/RideCard';
import ScreenWrapper from '../components/ScreenWrapper';
import TabSwitcher from '../components/TabSwitcher';
import EmptyState from '../components/EmptyState';
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
    // TODO: Integrate with backend API
    // Example: const response = await fetch('YOUR_API_ENDPOINT/rides');
    // const data = await response.json();
    // setUpcomingRides(data.upcoming);
    // setCompletedRides(data.completed);

    // Currently using mock data for development
    setUpcomingRides(mockUpcomingRides);
    setCompletedRides(mockCompletedRides);
    setLocalUpcomingRides(mockUpcomingRides);
    setLocalCompletedRides(mockCompletedRides);
  }, [setUpcomingRides, setCompletedRides]);

  const loadRides = () => {
    // TODO: Integrate with backend API
    setUpcomingRides(mockUpcomingRides);
    setCompletedRides(mockCompletedRides);
    setLocalUpcomingRides(mockUpcomingRides);
    setLocalCompletedRides(mockCompletedRides);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRides();
    setRefreshing(false);
  };

  const handleStartRide = async (rideId: string) => {
    try {
      await startRide(rideId);
      setLocalUpcomingRides((prev) => prev.filter((r) => r.id !== rideId));
      navigation.navigate('RideDetail', { rideId });
    } catch (error) {
      // Silently handle errors
    }
  };

  const displayRides = activeTab === 'upcoming' ? localUpcomingRides : localCompletedRides;

  return (
    <ScreenWrapper
      showSettingsButton
      onSettingsPress={() => navigation.navigate('Settings')}
    >
      <View style={styles.container}>
        <Header
          title="Rides"
          onBackPress={() => navigation.goBack()}
        />

        {/* Tab Switcher */}
        <TabSwitcher
          tabs={[
            { id: 'upcoming', label: 'Upcoming', count: localUpcomingRides.length },
            { id: 'completed', label: 'Completed', count: localCompletedRides.length },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as RideTab)}
        />

        {/* Rides List */}
        <FlatList
          data={displayRides}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState message={`No ${activeTab} rides`} />
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
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  rideWrapper: {
    marginBottom: SIZES.md,
  },
});

export default RidesScreen;
