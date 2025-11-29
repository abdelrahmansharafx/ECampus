import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';
import FloatingSettingsButton from './FloatingSettingsButton';

interface ScreenWrapperProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  showSettingsButton?: boolean;
  settingsIcon?: string;
  onSettingsPress?: () => void;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  edges = ['top'],
  showSettingsButton = true,
  settingsIcon,
  onSettingsPress,
}) => {
  return (
    <LinearGradient
      colors={COLORS.gradient.grayscale}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
        {showSettingsButton && onSettingsPress && (
          <FloatingSettingsButton icon={settingsIcon} onPress={onSettingsPress} />
        )}
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
});

export default ScreenWrapper;

