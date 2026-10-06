import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT, FieldLabel } from './ListingControls';

/* Plain round text input */
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

/* Small square checkbox with label ("Entire Home") */
export const CheckboxField = ({ label, checked, onChange }) => (
  <TouchableOpacity
    style={styles.checkRow}
    activeOpacity={0.7}
    onPress={() => onChange(!checked)}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
      {checked && <View style={styles.checkMark} />}
    </View>
    <Text style={styles.checkLabel}>{label}</Text>
  </TouchableOpacity>
);

/* Yes / No cards (Screening step) */
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
            i !== options.length - 1 && { marginRight: 10 },
            selected && styles.optionCardOn,
          ]}
        >
          <View style={[styles.radio, selected && styles.radioOn]}>
            {selected && <View style={styles.radioCheck} />}
          </View>
          <Text style={[styles.optionText, selected && styles.optionTextOn]}>{opt}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  fieldWrap: { marginBottom: 12 },
  inputBox: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: COLORS.text,
    paddingVertical: 0,
  },
  calendarIcon: { width: 14, height: 14, tintColor: '#777777' },

  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 4 },
  checkBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#9A9A9A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkBoxOn: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  checkMark: {
    width: 3,
    height: 6,
    borderRightWidth: 1.4,
    borderBottomWidth: 1.4,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -1,
  },
  checkLabel: { fontFamily: FONT.regular, fontSize: 8.5, color: '#555555', marginLeft: 6 },

  cardsRow: { flexDirection: 'row', marginTop: 4 },
  optionCard: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  optionCardOn: { borderColor: COLORS.orange, backgroundColor: '#FFF3EF' },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#B5B5B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOn: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  radioCheck: {
    width: 3,
    height: 6,
    borderRightWidth: 1.4,
    borderBottomWidth: 1.4,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -1,
  },
  optionText: { fontFamily: FONT.regular, fontSize: 10, color: COLORS.text },
  optionTextOn: { color: COLORS.orange, fontFamily: FONT.medium },
});