import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FONT_MEDIUM = 'Poppins-Medium';

/**
 * Chevron drawn with two borders (Figma "ion:chevron-back", 24px box, 2.25 stroke).
 */
export const BackChevron = ({ color = '#444444' }) => (
  <View style={styles.chevronBox}>
    <View style={[styles.chevron, { borderColor: color }]} />
  </View>
);

/**
 * Figma header frame: 375 x 52, back chevron at left 15, title 18/500 centered.
 *
 * Props:
 *  - title      : header text
 *  - onBack     : press handler for the chevron (hidden when not given)
 *  - dark       : true = white text on dark background (Gallery photo screen)
 *  - right      : optional node placed at the right edge (right: 15)
 *  - children   : optional node placed at the left edge instead of the chevron
 */
const ScreenHeader = ({ title, onBack, dark = false, right = null }) => {
  const color = dark ? '#FFFFFF' : '#444444';
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity
          style={styles.back}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackChevron color={color} />
        </TouchableOpacity>
      ) : null}

      <Text style={[styles.title, { color }]} numberOfLines={1}>
        {title}
      </Text>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: 15,
    top: 14,
    width: 24,
    height: 24,
  },
  chevronBox: {
    width: 24,
    height: 24,
  },
  chevron: {
    position: 'absolute',
    left: 10.5,
    top: 7.25,
    width: 9.5,
    height: 9.5,
    borderLeftWidth: 2.25,
    borderBottomWidth: 2.25,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontFamily: FONT_MEDIUM,
    fontSize: 18,
    lineHeight: 26,
    includeFontPadding: false,
    textAlign: 'center',
  },
  right: {
    position: 'absolute',
    right: 15,
    top: 14,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ScreenHeader;
