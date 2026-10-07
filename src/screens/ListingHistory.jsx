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

/**
 * "Listing History": title 14/500, head 34 high (#FED9CF, radius 8 8 0 0),
 * rows 52 high, padding 24.
 */
const ListingHistory = ({ rows = DEFAULT_ROWS }) => (
  <View>
    <Text style={styles.title}>Listing History</Text>

    <View style={styles.table}>
      <View style={styles.headerRow}>
        <View style={styles.headCellDate}>
          <Text style={styles.headerText}>Date</Text>
        </View>
        <View style={styles.headCellStatus}>
          <Text style={styles.headerText}>Status</Text>
        </View>
        <View style={styles.headCellPrice}>
          <Text style={styles.headerText}>Price</Text>
        </View>
      </View>

      {rows.map((row) => (
        <View key={row.id} style={styles.row}>
          <View style={styles.cellDate}>
            <Text style={styles.cellText}>{row.date}</Text>
          </View>
          <View style={styles.cellStatus}>
            <Text style={styles.cellText}>{row.status}</Text>
          </View>
          <View style={styles.cellPrice}>
            {row.up && <UpArrow />}
            <Text style={styles.cellText}>{row.price}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#303131',
    includeFontPadding: false,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerRow: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FED9CF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headCellDate: { width: 107 },
  headCellStatus: { width: 109 },
  headCellPrice: { flex: 1 },
  headerText: {
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 14,
    color: 'rgba(0,0,0,0.8)',
    includeFontPadding: false,
  },
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cellDate: { width: 104 },
  cellStatus: { width: 112 },
  cellPrice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#14191F',
    includeFontPadding: false,
  },
  arrowText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: GREEN,
    marginRight: 1,
  },
  arrowImage: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
});

export default ListingHistory;
