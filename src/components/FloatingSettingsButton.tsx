import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

interface FloatingSettingsButtonProps {
  onPress: () => void;
  icon?: string; // Optional icon name, defaults to 'settings-outline'
}

const FloatingSettingsButton: React.FC<FloatingSettingsButtonProps> = ({ onPress, icon = 'settings-outline' }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon as any} size={24} color={COLORS.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: SIZES.xl,
    right: SIZES.md,
    width: 56,
    height: 56,
    borderRadius: 28, // Perfect circle
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker background for better visibility
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)', // Subtle border
    justifyContent: 'center',
    alignItems: 'center',
    // Strong shadow below to show floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
    zIndex: 1000,
  },
});

export default FloatingSettingsButton;

