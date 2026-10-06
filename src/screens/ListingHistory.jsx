import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ICONS } from '../assets';

const GREEN = '#2EB872';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

const DEFAULT_ROWS = [
  { id: 'h1', date: 'Jan 5, 2025', status: 'Listing Expired', price: '$100,000' },
  { id: 'h2', date: 'Dec 3, 2024', status: 'Listing Expired', price: '$100,000', up: true },
];

const UpArrow = () =>
  ICONS.arrowUp ? (
    <Image source={ICONS.arrowUp} style={styles.arrowImage} resizeMode="contain" />
  ) : (
    <Text style={styles.arrowText}>↑</Text>
  );

/** "Listing History" table. */
const ListingHistory = ({ rows = DEFAULT_ROWS }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Listing History</Text>

    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.colDate]}>Date</Text>
        <Text style={[styles.headerText, styles.colStatus]}>Status</Text>
        <Text style={[styles.headerText, styles.colPrice]}>Price</Text>
      </View>

      {rows.map((row, i) => (
        <View
          key={row.id}
          style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
        >
          <Text style={[styles.cellText, styles.colDate]}>{row.date}</Text>
          <Text style={[styles.cellText, styles.colStatus]}>{row.status}</Text>
          <View style={[styles.priceCell, styles.colPrice]}>
            {row.up && <UpArrow />}
            <Text style={styles.cellText}>{row.price}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  title: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#1A1A1A',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDCD2',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  headerText: {
    fontFamily: FONT.regular,
    fontSize: 9,
    color: '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  cellText: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#1A1A1A',
  },
  colDate: {
    flex: 1.05,
  },
  colStatus: {
    flex: 1.25,
  },
  colPrice: {
    flex: 1,
  },
  priceCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: GREEN,
    marginRight: 1,
  },
  arrowImage: {
    width: 9,
    height: 9,
    marginRight: 2,
  },
});

export default ListingHistory;
