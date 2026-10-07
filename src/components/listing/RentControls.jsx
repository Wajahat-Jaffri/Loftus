import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT, FieldLabel } from './ListingControls';

const CHECK_PNG = require('../../assets/icons/Check.png');

/* Plain round text input (Figma: 48 high, text 14 / #404040) */
export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'words',
  maxLength,
  containerStyle,
}) => (
  <View style={[styles.fieldWrap, containerStyle]}>
    {!!label && <FieldLabel>{label}</FieldLabel>}
    <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
    </View>
  </View>
);

/* Date of birth: typed as dd/mm/yyyy (slashes auto), calendar icon on the right */
const formatDateInput = (text) => {
  const d = text.replace(/\D/g, '').slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
};

export const DobField = ({ label, value, onChangeText, containerStyle }) => (
  <View style={[styles.fieldWrap, containerStyle]}>
    {!!label && <FieldLabel>{label}</FieldLabel>}
    <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(t) => onChangeText(formatDateInput(t))}
        placeholder="dd/mm/yyyy"
        placeholderTextColor={COLORS.placeholder}
        keyboardType="number-pad"
        maxLength={10}
      />
      <Image source={ICONS.calendar} style={styles.calendarIcon} resizeMode="contain" />
    </View>
  </View>
);

/* Square checkbox with label ("Entire Home"). Figma: 22 x 22, radius 4, label 11/16 */
export const CheckboxField = ({ label, checked, onChange }) => (
  <TouchableOpacity
    style={styles.checkRow}
    activeOpacity={0.7}
    onPress={() => onChange(!checked)}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
      {checked && <Image source={CHECK_PNG} style={styles.checkTick} resizeMode="contain" />}
    </View>
    <Text style={styles.checkLabel}>{label}</Text>
  </TouchableOpacity>
);

/* Yes / No cards (Screening step). Figma: 164.5 x 50, radius 4, 16px gap between cards */
export const OptionCards = ({ options, value, onChange }) => (
  <View style={styles.cardsRow}>
    {options.map((opt, i) => {
      const selected = value === opt;
      return (
        <TouchableOpacity
          key={opt}
          activeOpacity={0.8}
          onPress={() => onChange(opt)}
          style={[
            styles.optionCard,
            i !== options.length - 1 && { marginRight: 16 },
            selected && styles.optionCardOn,
          ]}
        >
          <View style={[styles.radio, selected && styles.radioOn]}>
            {selected && <Image source={CHECK_PNG} style={styles.radioTick} resizeMode="contain" />}
          </View>
          <Text style={[styles.optionText, selected && styles.optionTextOn]}>{opt}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  fieldWrap: { alignSelf: 'stretch' },
  inputBox: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    borderRadius: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 46,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.fieldText,
    paddingVertical: 0,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  calendarIcon: { width: 24, height: 24, marginLeft: 8, tintColor: COLORS.placeholder },

  checkRow: { flexDirection: 'row', alignItems: 'center', height: 22 },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A5A5A5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkBoxOn: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  checkTick: { width: 14, height: 14, tintColor: '#FFFFFF' },
  checkLabel: {
    marginLeft: 8,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#707070',
    includeFontPadding: false,
  },

  cardsRow: { flexDirection: 'row' },
  optionCard: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  optionCardOn: { borderColor: COLORS.orange },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioOn: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  radioTick: { width: 12, height: 12, tintColor: '#FFFFFF' },
  optionText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#888888',
    includeFontPadding: false,
  },
  optionTextOn: { color: '#5B5B5B' },
});
