import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, formatMoney, prettyDate } from '../ListingControls';

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Title = ({ children, first }) => (
  <Text style={[styles.title, first && { marginTop: 0 }]}>{children}</Text>
);

const RentConfirmationStep = ({ form, screening, identity, openHouses }) => {
  const fullName = [identity.firstName, identity.middleName, identity.lastName]
    .filter(Boolean)
    .join(' ');
  const address = [identity.address1, identity.address2].filter(Boolean).join(', ');

  return (
    <View>
      <Title first>Rent</Title>
      <Row label="Available Date" value={prettyDate(form.availableDate)} />
      <Row label="Offer Deadline" value={prettyDate(form.offerDeadline)} />
      <Row label="Lease Term" value={form.leaseTerm || '-'} />
      <Row label="Rent" value={formatMoney(form.rent)} />
      <Row label="Deposit" value={formatMoney(form.deposit)} />
      <Row label="Entire Home" value={form.entireHome ? 'Yes' : 'No'} />

      <Title>Screening</Title>
      <Row label="Credit & Criminal Evictions & ID" value={screening} />

      <Title>Identity</Title>
      <Row label="Full Name" value={fullName || '-'} />
      <Row label="Date of Birth" value={prettyDate(identity.dob)} />
      <Row label="Address" value={address || '-'} />
      <Row label="City" value={identity.city || '-'} />
      <Row label="State" value={identity.state || '-'} />
      <Row label="Zip code" value={identity.zip || '-'} />

      {openHouses.length > 0 && (
        <>
          <Title>Open Houses</Title>
          {openHouses.map((h) => (
            <View key={h.id} style={styles.box}>
              <Text style={styles.boxText}>{prettyDate(h.date)}</Text>
              <Text style={styles.boxText}>
                {h.start} - {h.end}
              </Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT.medium,
    fontSize: 10,
    color: COLORS.orange,
    marginTop: 16,
    marginBottom: 2,
  },
  row: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  label: { fontFamily: FONT.regular, fontSize: 10, color: COLORS.text, marginRight: 12 },
  value: {
    flex: 1,
    textAlign: 'right',
    fontFamily: FONT.regular,
    fontSize: 10,
    color: COLORS.text,
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
    marginTop: 8,
  },
  boxText: { fontFamily: FONT.regular, fontSize: 9, color: COLORS.text },
});

export default RentConfirmationStep;