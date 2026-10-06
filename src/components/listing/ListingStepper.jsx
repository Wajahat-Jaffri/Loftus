import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT } from './ListingControls';

const DOT = 18;
const TRACK_H = 8;
const LABEL_W = 110;
const TRACK_TOP = 26;

const ListingStepper = ({ steps, current }) => {
  const [width, setWidth] = useState(0);
  const n = steps.length;

  // dots track ke dono sirey se thoda andar hain (picture jaisa)
  const inset = width * 0.1;
  const span = Math.max(width - inset * 2, 0);
  const centerOf = (i) => inset + (n > 1 ? (span * i) / (n - 1) : 0);

  const labelLeft = Math.min(
    Math.max(centerOf(current) - LABEL_W / 2, 0),
    Math.max(width - LABEL_W, 0)
  );

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <>
          <Text style={[styles.label, { left: labelLeft }]}>{steps[current]}</Text>

          <View style={styles.track} />

          {steps.map((s, i) => {
            const active = i === current;
            return (
              <View
                key={s}
                style={[
                  styles.dot,
                  { left: centerOf(i) - DOT / 2 },
                  active ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { height: 48, marginTop: 6, marginBottom: 14 },
  label: {
    position: 'absolute',
    top: 0,
    width: LABEL_W,
    textAlign: 'center',
    fontFamily: FONT.semi,
    fontSize: 12,
    color: COLORS.orange,
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: TRACK_TOP,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: '#EBEBEB',
  },
  dot: {
    position: 'absolute',
    top: TRACK_TOP + TRACK_H / 2 - DOT / 2,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dotActive: { backgroundColor: COLORS.orange },
  dotInactive: { backgroundColor: '#FFB9A5' },
});

export default ListingStepper;