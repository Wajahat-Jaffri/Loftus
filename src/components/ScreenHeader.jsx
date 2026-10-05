import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TEXT = '#1C1C1C';

/** Back arrow + centered title + optional right element (pass a <TouchableOpacity> / <Image>). */
const ScreenHeader = ({ title, onBack, right }) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.side}
      onPress={onBack}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.backArrow} />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.side}>{right || null}</View>
  </View>
);

export default ScreenHeader;

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  side: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Poppins-Medium', fontSize: 15, color: TEXT },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
});
