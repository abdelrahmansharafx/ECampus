import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants';

interface EmptyStateProps {
  message: string;
  style?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  text: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default EmptyState;

