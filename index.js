import React from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { DriverProvider } from './src/context/DriverContext';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DriverProvider>
          <RootNavigator />
        </DriverProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent('main', () => App);
