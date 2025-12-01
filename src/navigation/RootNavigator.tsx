import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants';

// Screens
import HomeScreen from '../screens/HomeScreen';
import RidesScreen from '../screens/RidesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RideDetailScreen from '../screens/RideDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const LoadingScreen = () => (
  <LinearGradient
    colors={COLORS.gradient.grayscale}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.loadingContainer}
  >
    <ActivityIndicator size="large" color={COLORS.white} />
  </LinearGradient>
);

const RootNavigator = () => {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Dashboard" component={HomeScreen} />
            <Stack.Screen name="Rides" component={RidesScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="RideDetail" component={RideDetailScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;
