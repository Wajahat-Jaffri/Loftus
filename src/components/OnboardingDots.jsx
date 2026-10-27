import React from 'react';
import { View, StyleSheet } from 'react-native';

const ORANGE = '#FF6C40';

/**
 * Figma page dots: 69 x 9, gap 8.
 * active dot 9 x 9 orange, the others 7 x 7 #E5E5E5.
 * `active` is the 0-based index of the current page.
 */
const OnboardingDots = ({ count = 5, active = 0, style }) => (
  <View style={[styles.row, style]} pointerEvents="none">
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={[
          i === active ? styles.dotActive : styles.dot,
          i < count - 1 && { marginRight: 8 },
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { height: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#E5E5E5' },
  dotActive: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: ORANGE },
});

export default OnboardingDots;
