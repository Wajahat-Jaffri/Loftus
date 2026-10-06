import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT } from '../ListingControls';
import { OptionCards } from '../RentControls';

const ScreeningStep = ({ value, onChange }) => (
  <View>
    <Text style={styles.text}>
      Are applicants required to provide their screening results with their offer? Screening
      results include credit, criminal, eviction proceedings, and ID verification reports.
    </Text>
    <OptionCards options={['No', 'Yes']} value={value} onChange={onChange} />
  </View>
);

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.text,
    marginBottom: 14,
    marginTop: 4,
  },
});

export default ScreeningStep;