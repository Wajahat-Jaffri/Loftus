import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ORANGE = '#FF6C40';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const DEFAULT_OPEN_HOUSES = [
  { id: 'oh1', day: '10', month: 'AUG', weekday: 'Thursday', from: '12:00 AM', to: '12:00 AM' },
  { id: 'oh2', day: '11', month: 'AUG', weekday: 'Friday', from: '01:00 PM', to: '02:00 PM' },
  { id: 'oh3', day: '12', month: 'AUG', weekday: 'Saturday', from: '10:00 AM', to: '02:00 PM' },
];

const TimePill = ({ label }) => (
  <View style={styles.pill}>
    <Text style={styles.pillText}>{label}</Text>
  </View>
);

/**
 * "Open Houses": Figma cards 240 x 144 (radius 15, border #EEE), gap 17.
 * Place it inside a parent with 15px side padding (it breaks out of it by itself).
 */
const OpenHouses = ({ items = DEFAULT_OPEN_HOUSES }) => (
  <View>
    <Text style={styles.title}>Open Houses</Text>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.listContent}
    >
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.dateBlock}>
            <View style={styles.dateRow}>
              <Text style={styles.day}>{item.day}</Text>
              <Text style={styles.month}>{item.month}</Text>
            </View>
            <Text style={styles.weekday}>{item.weekday}</Text>
          </View>

          <View style={styles.timeRow}>
            <TimePill label={item.from} />
            <Text style={styles.toText}>To</Text>
            <TimePill label={item.to} />
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  title: {
    marginLeft: 7,
    marginBottom: 10,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },
  // The parent column has 15px side padding; the scroller breaks out of it
  // so the cards can slide to the screen edge. Cards start at Figma x = 12.
  scroll: {
    marginHorizontal: -15,
  },
  listContent: {
    paddingLeft: 12,
    paddingRight: 15,
  },
  card: {
    width: 240,
    height: 144,
    marginRight: 17,
    paddingVertical: 11,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  dateBlock: {
    height: 75,
    alignItems: 'center',
    marginBottom: 13,
  },
  dateRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  day: {
    fontFamily: FONT.semibold,
    fontSize: 32,
    lineHeight: 48,
    color: ORANGE,
    includeFontPadding: false,
  },
  month: {
    marginLeft: 4,
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 24,
    color: ORANGE,
    includeFontPadding: false,
  },
  weekday: {
    height: 27,
    fontFamily: FONT.medium,
    fontSize: 18,
    lineHeight: 27,
    color: '#000000',
    includeFontPadding: false,
  },
  timeRow: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    minWidth: 70,
    height: 26,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.9,
    borderColor: '#DFDFDF',
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
  },
  pillText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },
  toText: {
    marginHorizontal: 20,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },
});

export default OpenHouses;
