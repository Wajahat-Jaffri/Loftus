import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const PLACEHOLDER = '#9A9A9A';

const FONT = { medium: 'Poppins-Medium' };

/** Figma ion:filter — three centered bars (38 x 34 box). */
const FilterIcon = () => (
  <View style={styles.filterIcon}>
    <View style={[styles.bar, { width: 24 }]} />
    <View style={[styles.bar, { width: 16 }]} />
    <View style={[styles.bar, { width: 8 }]} />
  </View>
);

/**
 * Figma search row: 345 x 44 -> pill (295 x 44, radius 67) + filter icon (38 x 34).
 *
 * Props:
 *  - value / onChangeText : text of the search field
 *  - editable             : false = the whole pill is a button (Explore screen)
 *  - onPressSearch        : used when editable is false
 *  - onPressFilter        : filter icon press
 */
const SearchRow = ({
  value,
  onChangeText,
  editable = true,
  onPressSearch,
  onPressFilter,
}) => {
  const Pill = editable ? View : TouchableOpacity;
  const pillProps = editable ? {} : { activeOpacity: 0.8, onPress: onPressSearch };

  return (
    <View style={styles.row}>
      <Pill style={styles.pill} {...pillProps}>
        <Image source={ICONS.search} style={styles.searchIcon} resizeMode="contain" />
        {editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Search by Address, City, or ZIP"
            placeholderTextColor={PLACEHOLDER}
            style={styles.input}
            returnKeyType="search"
          />
        ) : (
          <Text style={styles.input} numberOfLines={1}>
            {value ? value : <Text style={styles.placeholder}>Search by Address, City, or ZIP</Text>}
          </Text>
        )}
      </Pill>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPressFilter}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <FilterIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 44,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flex: 1,
    height: 44,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    borderRadius: 67,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: PLACEHOLDER,
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#444444',
    includeFontPadding: false,
  },
  placeholder: {
    color: PLACEHOLDER,
  },
  filterIcon: {
    width: 38,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    height: 2.5,
    borderRadius: 2,
    backgroundColor: ORANGE,
    marginVertical: 1.5,
  },
});

export default SearchRow;
