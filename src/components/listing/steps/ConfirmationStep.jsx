import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SummaryRows, formatMoney, prettyDate } from '../ListingControls';

/* Figma: rows 345 x 50 (8px apart), then "Open Houses" 20px below with 12px to its first row */
const ConfirmationStep = ({ type, form, openHouses }) => (
  <View style={{ marginTop: 36 }}>
    <SummaryRows
      gap={8}
      rows={[
        { label: type === 'Rent' ? 'Rent' : 'Price', value: formatMoney(form.price) },
        { label: 'HOA Fee', value: formatMoney(form.hoaFee) },
        { label: 'HOA Fee Frequency', value: form.hoaFrequency || '-' },
        { label: 'Condo Fee', value: formatMoney(form.condoFee) },
        { label: 'Condo Fee Frequency', value: form.condoFrequency || '-' },
      ]}
    />

    {openHouses.length > 0 && (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>Open Houses</Text>
        <View style={{ marginTop: 12 }}>
          {openHouses.map((h, i) => (
            <View key={h.id} style={[styles.box, i > 0 && { marginTop: 8 }]}>
              <Text style={styles.rowDate}>{prettyDate(h.date)}</Text>
              <Text style={styles.rowTime}>
                {h.start} - {h.end}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    height: 24,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.32,
    color: COLORS.orange,
    includeFontPadding: false,
  },
  box: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  rowDate: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#202020',
    includeFontPadding: false,
  },
  rowTime: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#4B5563',
    includeFontPadding: false,
  },
});

export default ConfirmationStep;
