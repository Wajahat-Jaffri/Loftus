import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ICONS } from '../assets';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

const DEFAULT_ADDRESS =
  'Transportation near 5001 Greenhouse Terrace, Centreville, VA 20120';

const DEFAULT_SCORES = [
  { key: 'walk', icon: ICONS.walk, score: 25, label: 'Walk Score®', note: 'Car Dependent' },
  { key: 'bike', icon: ICONS.bike, score: 25, label: 'Bike Score®', note: 'Bike Score' },
  { key: 'transit', icon: ICONS.transit, score: 25, label: 'Transit Score®', note: 'Minimal Transit' },
];

/**
 * "Around this Home": Figma frame 353 x 158 (padding 13 / 8, gap 10),
 * three 105 x 86 score cards with gap 8.
 */
const AroundThisHome = ({ address = DEFAULT_ADDRESS, scores = DEFAULT_SCORES }) => (
  <View style={styles.wrapper}>
    <View style={styles.header}>
      <Text style={styles.title}>Around this Home</Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {address}
      </Text>
    </View>

    <View style={styles.row}>
      {scores.map((s) => (
        <View key={s.key} style={styles.card}>
          <Image source={s.icon} style={styles.icon} resizeMode="contain" />
          <View style={styles.textBlock}>
            <View style={styles.scoreRow}>
              <Text style={styles.score}>{s.score}</Text>
              <Text style={styles.scoreLabel} numberOfLines={1}>
                {s.label}
              </Text>
            </View>
            <Text style={styles.note} numberOfLines={1}>
              {s.note}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 13,
    paddingHorizontal: 4,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    includeFontPadding: false,
  },
  subtitle: {
    marginTop: 5,
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 15,
    color: '#686868',
    includeFontPadding: false,
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    width: 105,
    height: 86,
    marginRight: 8,
    paddingVertical: 7,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F4F4F4',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  textBlock: {
    width: 93,
  },
  scoreRow: {
    height: 21,
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    marginRight: 6,
    includeFontPadding: false,
  },
  scoreLabel: {
    flex: 1,
    marginTop: 3,
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 15,
    color: '#000000',
    includeFontPadding: false,
  },
  note: {
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 15,
    color: '#686868',
    includeFontPadding: false,
  },
});

export default AroundThisHome;
