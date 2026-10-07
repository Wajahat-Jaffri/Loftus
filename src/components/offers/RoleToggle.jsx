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
      <View style={[styles.labelWrap, isLandlord ? { left: 12 } : { right: 12 }]}>
        <Text style={styles.label}>{isLandlord ? 'Landlord' : 'Tenant'}</Text>
      </View>
      <View style={[styles.knob, isLandlord ? { right: 2 } : { left: 2 }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 92,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFC9B8',
    backgroundColor: '#FFFFFF',
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  label: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.orange },
  knob: {
    position: 'absolute',
    top: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.orange,
  },
});

export default RoleToggle;
