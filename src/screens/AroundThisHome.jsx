import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ICONS } from '../assets';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const DEFAULT_ADDRESS =
  'Transportation near 5001 Greenhouse Terrace, Centreville, VA 20120';

const DEFAULT_SCORES = [
  { key: 'walk', icon: ICONS.walk, score: 25, label: 'Walk Score®', note: 'Car Dependent' },
  { key: 'bike', icon: ICONS.bike, score: 25, label: 'Bike Score®', note: 'Bike Score' },
  { key: 'transit', icon: ICONS.transit, score: 25, label: 'Transit Score®', note: 'Minimal Transit' },
];

/** "Around this Home" — walk / bike / transit scores. */
const AroundThisHome = ({ address = DEFAULT_ADDRESS, scores = DEFAULT_SCORES }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Around this Home</Text>
    <Text style={styles.subtitle}>{address}</Text>

    <View style={styles.row}>
      {scores.map((s) => (
        <View key={s.key} style={styles.card}>
          <Image source={s.icon} style={styles.icon} resizeMode="contain" />
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
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: 9,
    color: '#8A8A8A',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '31.5%',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  icon: {
    width: 26,
    height: 26,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  score: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    lineHeight: 18,
    color: '#1A1A1A',
    marginRight: 3,
  },
  scoreLabel: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 8,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  note: {
    fontFamily: FONT.regular,
    fontSize: 8,
    color: '#8A8A8A',
    marginTop: 4,
  },
});

export default AroundThisHome;
