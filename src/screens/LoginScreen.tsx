import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SIZES } from '../constants';
import Button from '../components/Button';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();

  useEffect(() => {
    // Request location permissions when login screen loads
    const requestLocationPermission = async () => {
      try {
        // Request permission directly - this will show the system dialog
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          // If denied, show alert but don't block - user can enable in settings later
          Alert.alert(
            'Location Permission',
            'Location access is recommended for tracking rides. You can enable it later in Settings.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        // Silently handle errors - permission request will be available in settings
      }
    };

    // Request immediately when screen loads
    requestLocationPermission();
  }, []);

  const handleLogin = async () => {
    try {
      // Allow login even without location permission
      // Location can be enabled later in settings
      
      // TODO: Integrate with backend API
      // Example: await login(email, password, 'driver');
      
      // Mock login with driver role for development
      await login('driver@example.com', 'password', 'driver');
    } catch (error) {
      // Silently handle login errors
    }
  };

  return (
    <LinearGradient
      colors={COLORS.gradient.grayscale}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Vector Icon Background */}
      <View style={styles.vectorContainer}>
        <Image 
          source={require('../../assets/images/Vector.png')} 
          style={styles.vectorImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteLine1}>Think Big.</Text>
          <Text style={styles.quoteLine2}>Start Small.</Text>
          <Text style={styles.quoteLine3}>Work Fast.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Get Started" onPress={handleLogin} variant="primary" size="large" borderRadius={SIZES.md} borderWidth={0} transparent />
          </View>
        </View>
        <Text style={styles.copyright}>Your copyright text can be placed here.</Text>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  vectorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  vectorImage: {
    width: '120%',
    height: '120%',
    opacity: 0.25,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
    paddingBottom: 40,
    zIndex: 1,
  },
  quoteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 60,
  },
  quoteLine1: {
    fontSize: 38,
    fontWeight: '400',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'serif',
    marginBottom: 4,
  },
  quoteLine2: {
    fontSize: 38,
    fontWeight: '400',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'serif',
    marginBottom: 4,
  },
  quoteLine3: {
    fontSize: 38,
    fontWeight: '400',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  buttonWrapper: {
    width: '85%',
    alignSelf: 'center',
  },
  copyright: {
    fontSize: 11,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;

