import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT } from '../listing/ListingControls';

/**
 * Figma toggle: 30 high, 1px #DEDEDE border, radius 80, padding 0 4, gap 6.
 *  - Landlord: [label 51][gap 6][knob 22]  => 87 wide
 *  - Tenant  : [knob 22][gap 6][label 51]  => 90 wide
 * Label 11/400 orange at 60% opacity, knob 22 orange.
 */
const RoleToggle = ({ value, onChange }) => {
  const isLandlord = value === 'landlord';
  const label = (
    <Text style={styles.label} numberOfLines={1}>
      {isLandlord ? 'Landlord' : 'Tenant'}
    </Text>
  );
  const knob = <View style={styles.knob} />;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.track, { width: isLandlord ? 87 : 90 }]}
      onPress={() => onChange(isLandlord ? 'tenant' : 'landlord')}
    >
      {isLandlord ? (
        <>
          {label}
          {knob}
        </>
      ) : (
        <>
          {knob}
          {label}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 30,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3, // Figma 4, minus the 1px border
  },
  label: {
    width: 51,
    marginHorizontal: 3,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.orange,
    opacity: 0.6,
    includeFontPadding: false,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.orange,
  },
});

export default RoleToggle;
