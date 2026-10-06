import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TIME_OPTIONS } from '../../../constants/listingData';
import { COLORS, AddLink, DateField, SelectField, CloseIcon } from '../ListingControls';

const OpenHouseStep = ({ openHouses, onAdd, onRemove, onUpdate }) => (
  <View>
    {openHouses.map((h) => (
      <View key={h.id} style={styles.card}>
        <DateField
          value={h.date}
          onChangeText={(v) => onUpdate(h.id, { date: v })}
          containerStyle={{ marginBottom: 10 }}
        />

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

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(h.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <CloseIcon size={8} color="#FFFFFF" thickness={1.4} />
        </TouchableOpacity>
      </View>
    ))}

    <AddLink label="Add" onPress={onAdd} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    elevation: 5,
  },
  timeRow: { flexDirection: 'row' },
});

export default OpenHouseStep;