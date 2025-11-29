import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  borderRadius?: number; // Optional custom border radius
  borderWidth?: number; // Optional custom border width (0 to remove border)
  transparent?: boolean; // Optional to make background transparent
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  borderRadius,
  borderWidth,
  transparent = false,
}) => {
  const backgroundColor =
    variant === 'primary'
      ? COLORS.primary // Gray matching gradient theme
      : variant === 'danger'
        ? COLORS.danger
        : COLORS.secondary; // Gray matching gradient theme

  const paddingVertical = size === 'small' ? SIZES.sm : size === 'large' ? SIZES.lg : SIZES.md;
  const fontSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;

  // Convert hex to rgba for transparency
  const getTransparentColor = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const transparentBg = transparent
    ? 'transparent'
    : disabled 
      ? 'rgba(200, 200, 200, 0.3)' 
      : getTransparentColor(backgroundColor, 0.3);
  
  const borderColor = transparent
    ? 'transparent'
    : disabled
      ? 'rgba(200, 200, 200, 0.5)'
      : getTransparentColor(backgroundColor, 0.6);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: transparentBg,
          borderColor: borderColor,
          paddingVertical,
          borderRadius: borderRadius !== undefined ? borderRadius : 999,
          borderWidth: borderWidth !== undefined ? borderWidth : 1.5,
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { fontSize, color: COLORS.white }]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 999, // Pill shape - very high border radius
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  text: {
    fontWeight: '600',
  },
});

export default Button;
