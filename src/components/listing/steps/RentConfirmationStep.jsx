import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SummaryRows, formatMoney, prettyDate } from '../ListingControls';

const Title = ({ children, style }) => <Text style={[styles.title, style]}>{children}</Text>;

/* Figma: section title 24 high, rows 50 high stacked without gaps, 16px between sections */
const RentConfirmationStep = ({ form, screening, identity, openHouses }) => {
  const fullName = [identity.firstName, identity.middleName, identity.lastName]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(' ');
  const address = [identity.address1, identity.address2]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(', ');

  return (
    <View style={{ marginTop: 24 }}>
      <Title>Rent</Title>
      <SummaryRows
        rows={[
          { label: 'Available Date', value: prettyDate(form.availableDate) },
          { label: 'Offer Deadline', value: prettyDate(form.offerDeadline) },
          { label: 'Lease Term', value: form.leaseTerm || '-' },
          { label: 'Rent', value: formatMoney(form.rent) },
          { label: 'Deposit', value: formatMoney(form.deposit) },
          { label: 'Entire Home', value: form.entireHome ? 'Yes' : 'No' },
        ]}
      />

      <Title style={{ marginTop: 16 }}>Screening</Title>
      <SummaryRows rows={[{ label: 'Credit & Criminal Evictions & ID', value: screening }]} />

      <Title style={{ marginTop: 16 }}>Identity</Title>
      <SummaryRows
        rows={[
          { label: 'Full Name', value: fullName || '-' },
          { label: 'Date of Birth', value: prettyDate(identity.dob) },
          { label: 'Address', value: address || '-', small: true },
          { label: 'City', value: identity.city || '-' },
          { label: 'State', value: identity.state || '-' },
          { label: 'Zip code', value: identity.zip || '-' },
        ]}
      />

      {openHouses.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Title>Open Houses</Title>
          <View style={{ marginTop: 12 }}>
            {openHouses.map((h, i) => (
              <View key={h.id} style={[styles.box, i > 0 && { marginTop: 8 }]}>
                <Text style={styles.boxDate}>{prettyDate(h.date)}</Text>
                <Text style={styles.boxTime}>
                  {h.start} - {h.end}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
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
  boxDate: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#202020',
    includeFontPadding: false,
  },
  boxTime: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#4B5563',
    includeFontPadding: false,
  },
});

export default RentConfirmationStep;
