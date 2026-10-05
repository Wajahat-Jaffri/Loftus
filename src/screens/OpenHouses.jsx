import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#FF6C40';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const { width: SCREEN_W } = Dimensions.get('window');
// Leave a peek of the next card on the right, like the Figma design.
const CARD_W = SCREEN_W - 40 - 30;
const CARD_GAP = 12;

const DEFAULT_OPEN_HOUSES = [
  { id: 'oh1', day: '10', month: 'AUG', weekday: 'Thursday', from: '12:00 AM', to: '12:00 AM' },
  { id: 'oh2', day: '11', month: 'AUG', weekday: 'Friday', from: '01:00 PM', to: '12:00 AM' },
  { id: 'oh3', day: '12', month: 'AUG', weekday: 'Saturday', from: '10:00 AM', to: '02:00 PM' },
];

const TimePill = ({ label }) => (
  <View style={styles.pill}>
    <Text style={styles.pillText}>{label}</Text>
  </View>
);

/** "Open Houses" — horizontally scrolling date cards. */
const OpenHouses = ({ items = DEFAULT_OPEN_HOUSES }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Open Houses</Text>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_W + CARD_GAP}
      decelerationRate="fast"
      contentContainerStyle={styles.listContent}
    >
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.dateRow}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.month}>{item.month}</Text>
          </View>

          <Text style={styles.weekday}>{item.weekday}</Text>

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
  wrapper: {
    marginTop: 22,
  },
  title: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_W,
    marginRight: CARD_GAP,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  day: {
    fontFamily: FONT.semibold,
    fontSize: 28,
    lineHeight: 32,
    color: ORANGE,
  },
  month: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: ORANGE,
    marginLeft: 4,
    marginBottom: 4,
  },
  weekday: {
    fontFamily: FONT.semibold,
    fontSize: 18,
    color: '#1A1A1A',
    marginTop: 6,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  pillText: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#6B6B6B',
  },
  toText: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#6B6B6B',
    marginHorizontal: 10,
  },
});

export default OpenHouses;
