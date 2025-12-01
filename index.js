import React from 'react';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { DriverProvider } from './src/context/DriverContext';
import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <DriverProvider>
            <RootNavigator />
          </DriverProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

console.log('Registering root component...');
registerRootComponent(App);
