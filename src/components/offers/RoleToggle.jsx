import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT } from '../listing/ListingControls';

const RoleToggle = ({ value, onChange }) => {
  const isLandlord = value === 'landlord';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.track}
      onPress={() => onChange(isLandlord ? 'tenant' : 'landlord')}
    >
      <View style={[styles.labelWrap, isLandlord ? { left: 10 } : { right: 10 }]}>
        <Text style={styles.label}>{isLandlord ? 'Landlord' : 'Tenant'}</Text>
      </View>
      <View style={[styles.knob, isLandlord ? { right: 2 } : { left: 2 }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 78,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  label: { fontFamily: FONT.regular, fontSize: 8, color: COLORS.grey },
  knob: {
    position: 'absolute',
    top: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.orange,
  },
});

export default RoleToggle;