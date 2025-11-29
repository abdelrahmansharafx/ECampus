import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import * as Location from 'expo-location';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import ScreenWrapper from '../components/ScreenWrapper';
import Section from '../components/Section';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    // Check current location permission status
    const checkLocationPermission = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setLocationEnabled(status === 'granted');
      } catch (error) {
        // Silently handle errors
      }
    };

    checkLocationPermission();
  }, []);

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      // Request permission
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationEnabled(true);
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required for tracking rides. Please enable it in your device settings.',
            [{ text: 'OK' }]
          );
          setLocationEnabled(false);
        }
      } catch (error) {
        setLocationEnabled(false);
      }
    } else {
      // User wants to disable - show info that they need to disable in settings
      Alert.alert(
        'Disable Location',
        'To disable location tracking, please go to your device settings and revoke location permission for this app.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScreenWrapper
      showSettingsButton
      settingsIcon="home-outline"
      onSettingsPress={() => navigation.navigate('Dashboard')}
    >
      <ScrollView style={styles.container}>
        <Header title="Settings" onBackPress={() => navigation.goBack()} />

        <Section title="Preferences">
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Location Tracking</Text>
            <Switch
              value={locationEnabled}
              onValueChange={handleLocationToggle}
              trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: 'rgba(255, 255, 255, 0.5)' }}
              thumbColor={locationEnabled ? COLORS.white : 'rgba(255, 255, 255, 0.7)'}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Enabled</Text>
          </View>
        </Section>

        <Section title="About">
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </Section>

        <Section>
          <Button
            title="Help & Support"
            onPress={() => {
              // TODO: Navigate to help screen or open support
            }}
            variant="secondary"
          />
        </Section>

        <View style={{ height: SIZES.xl }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: SIZES.sm,
    marginBottom: SIZES.sm,
    borderRadius: SIZES.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  settingLabel: {
    fontSize: 14,
    color: COLORS.white,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.white,
  },
});

export default SettingsScreen;
