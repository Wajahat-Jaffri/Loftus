import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT } from '../ListingControls';
import { OptionCards } from '../RentControls';

/* Figma: text 20px from the left (340 wide, 95 high), cards 36px under it */
const ScreeningStep = ({ value, onChange }) => (
  <View style={{ marginTop: 29 }}>
    <View style={styles.box}>
      <Text style={styles.text}>
        Are applicants required to provide their screening results with their offer? Screening
        results include credit, criminal, eviction proceedings, and ID verification reports.
      </Text>
    </View>
    <View style={{ marginTop: 36 }}>
      <OptionCards options={['No', 'Yes']} value={value} onChange={onChange} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  box: { marginLeft: 5, height: 95 },
  text: {
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 20.8,
    color: '#505050',
    includeFontPadding: false,
  },
});

export default ScreeningStep;
