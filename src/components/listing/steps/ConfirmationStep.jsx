import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SummaryRows, formatMoney, prettyDate } from '../ListingControls';

const ConfirmationStep = ({ type, form, openHouses }) => (
  <View>
    <SummaryRows
      rows={[
        { label: type === 'Rent' ? 'Rent' : 'Price', value: formatMoney(form.price) },
        { label: 'HOA Fee', value: formatMoney(form.hoaFee) },
        { label: 'HOA Fee Frequency', value: form.hoaFrequency || '-' },
        { label: 'Condo Fee', value: formatMoney(form.condoFee) },
        { label: 'Condo Fee Frequency', value: form.condoFrequency || '-' },
      ]}
    />

    {openHouses.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Open Houses</Text>
        {openHouses.map((h) => (
          <View key={h.id} style={styles.box}>
            <Text style={styles.rowText}>{prettyDate(h.date)}</Text>
            <Text style={styles.rowText}>
              {h.start} - {h.end}
            </Text>
          </View>
        ))}
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FONT.medium,
    fontSize: 10,
    color: COLORS.orange,
    marginTop: 18,
    marginBottom: 8,
  },
  box: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  rowText: { fontFamily: FONT.regular, fontSize: 9, color: COLORS.text },
});

export default ConfirmationStep;