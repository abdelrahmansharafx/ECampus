import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Header title="Settings" onBackPress={() => navigation.goBack()} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Location Tracking</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>App Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Button
          title="Help & Support"
          onPress={() => console.log('Help tapped')}
          variant="secondary"
        />
      </View>

      <View style={{ height: SIZES.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.sm,
    marginBottom: SIZES.sm,
    borderRadius: SIZES.sm,
  },
  settingLabel: {
    fontSize: 14,
    color: COLORS.dark,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
});

export default SettingsScreen;
