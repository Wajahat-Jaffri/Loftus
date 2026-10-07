import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONT } from './ListingControls';

const CHECK_PNG = require('../../assets/icons/Check.png');

/*
 * Figma stepper (375 frame, content 345 wide, 15px side margin).
 * Dot lefts are measured inside the 345 wide track, label boxes inside the 375 frame.
 * Everything is stored as a fraction of the track so other screen widths still line up.
 */
const TRACK = 345;
const DOT = 14;

const LAYOUTS = {
  // Sale: 5 steps
  5: {
    dots: [28, 97, 166, 235, 304],
    labels: [
      [36, 30],
      [80, 84],
      [141.5, 92],
      [225, 60],
      [297, 63],
    ],
  },
  // Rent: 7 steps
  7: {
    dots: [1, 56, 111, 166, 221, 276, 329],
    labels: [
      [15, 32],
      [42, 70],
      [109, 53],
      [145, 84],
      [200, 92],
      [267, 60],
      [297, 63],
    ],
  },
};

const fallback = (n) => ({
  dots: Array.from({ length: n }, (_, i) => (n > 1 ? ((TRACK - DOT) * i) / (n - 1) : 0)),
  labels: Array.from({ length: n }, (_, i) => [
    15 + ((TRACK - 60) * i) / Math.max(n - 1, 1),
    60,
  ]),
});

const ListingStepper = ({ steps, current }) => {
  const [width, setWidth] = useState(0);
  const n = steps.length;
  const layout = LAYOUTS[n] || fallback(n);

  const x = (frameLeft) => (frameLeft / TRACK) * width; // inside the track
  const labelCenter = (i) => {
    const [left, w] = layout.labels[i];
    return ((left + w / 2 - 15) / TRACK) * width;
  };

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <>
          <View style={[styles.labelBox, { left: labelCenter(current) - 100 }]}>
            <Text style={styles.label} numberOfLines={1}>
              {steps[current]}
            </Text>
          </View>

          <View style={styles.track} />

          {layout.dots.map((left, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <View
                key={`${steps[i]}-${i}`}
                style={[
                  styles.dot,
                  { left: x(left + DOT / 2) - DOT / 2 },
                  done || active ? styles.dotOn : styles.dotOff,
                ]}
              >
                {done ? <Image source={CHECK_PNG} style={styles.dotCheck} resizeMode="contain" /> : null}
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

/* wrap = 50 high: label at top 7 (21 high), dots at top 36 (14 high) */
const styles = StyleSheet.create({
  wrap: { height: 50, marginHorizontal: 15 },
  labelBox: {
    position: 'absolute',
    top: 7,
    width: 200,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONT.semi,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.28,
    color: COLORS.orange,
    textAlign: 'center',
    includeFontPadding: false,
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 40,
    height: 6,
    borderRadius: 50,
    backgroundColor: '#ECECEC',
  },
  dot: {
    position: 'absolute',
    top: 36,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { backgroundColor: COLORS.orange },
  dotOff: { backgroundColor: '#FFB9A5' },
  dotCheck: { width: 10, height: 10, tintColor: '#FFFFFF' },
});

export default ListingStepper;
