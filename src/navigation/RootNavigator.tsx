import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants';

// Screens
import HomeScreen from '../screens/HomeScreen';
import RidesScreen from '../screens/RidesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RideDetailScreen from '../screens/RideDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DriverStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={HomeScreen} />
      <Stack.Screen name="Rides" component={RidesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="RideDetail" component={RideDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const DriverTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[400],
        tabBarLabel: ({ color, focused }) => {
          let label = '';
          switch (route.name) {
            case 'Home':
              label = 'Home';
              break;
            case 'MyRides':
              label = 'Rides';
              break;
            case 'ProfileTab':
              label = 'Profile';
              break;
            default:
              label = '';
          }
          return <Text style={{ color, fontSize: 12, fontWeight: focused ? '600' : '400' }}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={DriverStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="MyRides"
        component={RidesScreen}
        options={{
          tabBarLabel: 'Rides',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Placeholder Login Screen
const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Mock login with driver role
      await login('driver@example.com', 'password', 'driver');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <React.Fragment>
      {/* Simple placeholder - in production, create a proper login screen */}
      <Text onPress={handleLogin} style={{ padding: 20, color: COLORS.primary, fontSize: 18 }}>
        Login as Driver
      </Text>
    </React.Fragment>
  );
};

const RootNavigator = () => {
  const { isSignedIn, isLoading, userRole } = useAuth();

  if (isLoading) {
    return null; // Replace with loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            {userRole === 'driver' && (
              <Stack.Screen
                name="DriverApp"
                component={DriverTabNavigator}
              />
            )}
            {userRole === 'parent' && (
              <Stack.Screen
                name="ParentApp"
                component={DriverTabNavigator}
              />
            )}
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
