import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES } from '../constants';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  headerRight?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  style,
  titleStyle,
  headerRight,
}) => {
  return (
    <View style={[styles.section, style]}>
      {title && (
        <View style={styles.header}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {headerRight}
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default Section;

