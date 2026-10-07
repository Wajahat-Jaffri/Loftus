import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TIME_OPTIONS } from '../../../constants/listingData';
import { AddLink, DateField, SelectField } from '../ListingControls';

const CLOSE_PNG = require('../../../assets/icons/Close.png');

/*
 * Figma: grey card (#F3F3F3, radius 14, padding 16, gap 16), red X badge (24) on its top right
 * corner, "+ Add" 16px under the cards. Frame is 349 wide (2px wider than the page content).
 * topOffset: Sale 24 (Figma y 170), Rent 20 / 22 (y 166 / 168).
 */
const OpenHouseStep = ({ openHouses, onAdd, onRemove, onUpdate, topOffset = 24 }) => {
  const single = openHouses.length === 1;

  // Figma "empty" state: only "+ Add" (right aligned, 36px under the stepper)
  if (openHouses.length === 0) {
    return (
      <View style={{ marginTop: 36 }}>
        <AddLink label="Add" onPress={onAdd} />
      </View>
    );
  }

  return (
    <View style={[styles.frame, { marginTop: topOffset }]}>
      {openHouses.map((h) => (
        <View key={h.id} style={styles.item}>
          <View style={styles.card}>
            <DateField value={h.date} onChangeText={(v) => onUpdate(h.id, { date: v })} />
            <View style={styles.timeRow}>
              <SelectField
                variant="small"
                title="Start time"
                placeholder="Select Start Time"
                value={h.start}
                options={TIME_OPTIONS}
                onSelect={(v) => onUpdate(h.id, { start: v })}
              />
              <View style={{ width: 8 }} />
              <SelectField
                variant="small"
                title="End time"
                placeholder="Select End Time"
                value={h.end}
                options={TIME_OPTIONS}
                onSelect={(v) => onUpdate(h.id, { end: v })}
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.removeBtn}
            onPress={() => onRemove(h.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image source={CLOSE_PNG} style={styles.removeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ))}

      <AddLink label="Add" style={{ marginRight: single ? 4 : 0 }} onPress={onAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { marginHorizontal: -2 },
  item: { height: 153, marginBottom: 16 },
  card: {
    marginTop: 9,
    marginRight: 4,
    height: 144,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F3F3F3',
  },
  timeRow: { marginTop: 16, flexDirection: 'row' },
  removeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: '#F84949',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    elevation: 5,
  },
  removeIcon: { width: 12, height: 12, tintColor: '#FFFFFF' },
});

export default OpenHouseStep;
