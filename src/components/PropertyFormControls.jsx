import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export const ORANGE = '#FF6C40';
export const TEXT = '#1C1C1C';
const BORDER = '#E3E3E3';

export const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

/** Label + text input. `suffix` = small grey text on the right (mi, SF). */
export const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  suffix,
  multiline,
  style,
}) => (
  <View style={[styles.group, style]}>
    {!!label && <Text style={styles.label}>{label}</Text>}
    <View style={[styles.inputWrap, multiline && styles.inputWrapMulti]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B5B5B5"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.inputMulti]}
      />
      {!!suffix && <Text style={styles.suffix}>{suffix}</Text>}
    </View>
  </View>
);

/** Label + dropdown (list opens under the box). */
export const SelectField = ({ label, value, options, onChange, placeholder = 'Select..' }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.group}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.inputWrap, styles.selectWrap]}
        onPress={() => setOpen((o) => !o)}
      >
        <Text style={[styles.selectText, !value && { color: '#6B6B6B' }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <View style={[styles.chevron, open && { transform: [{ rotate: '225deg' }] }]} />
      </TouchableOpacity>
      {open && (
        <View style={styles.menu}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 170 }} keyboardShouldPersistTaps="handled">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.menuItem}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <Text style={[styles.selectText, opt === value && { color: ORANGE, fontFamily: FONT.medium }]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export const CheckItem = ({ label, checked, onPress }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.checkItem} onPress={onPress}>
    <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
      {checked ? <Text style={styles.checkTick}>✓</Text> : null}
    </View>
    <Text style={styles.checkLabel} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

/** 3 columns of checkboxes. */
export const CheckGrid = ({ items, selected, onToggle }) => (
  <View style={styles.checkGrid}>
    {items.map((it) => (
      <View key={it} style={styles.checkCell}>
        <CheckItem label={it} checked={selected.includes(it)} onPress={() => onToggle(it)} />
      </View>
    ))}
  </View>
);

export const PrimaryButton = ({ title, onPress, outlined, style }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.btn, outlined ? styles.btnOutlined : styles.btnFilled, style]}
  >
    <Text style={[styles.btnText, outlined && { color: ORANGE }]}>{title}</Text>
  </TouchableOpacity>
);

/** Small picture symbol drawn with views (used in upload boxes). */
export const ImageGlyph = ({ size = 22, color = '#9A9A9A' }) => (
  <View
    style={{
      width: size,
      height: size * 0.82,
      borderRadius: 3,
      borderWidth: 2,
      borderColor: color,
      overflow: 'hidden',
    }}
  >
    <View
      style={{
        position: 'absolute',
        top: size * 0.12,
        right: size * 0.16,
        width: size * 0.16,
        height: size * 0.16,
        borderRadius: size * 0.08,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: 'absolute',
        bottom: -size * 0.18,
        left: size * 0.08,
        width: size * 0.5,
        height: size * 0.5,
        backgroundColor: color,
        transform: [{ rotate: '45deg' }],
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontFamily: FONT.regular, fontSize: 9, color: TEXT, marginBottom: 5 },
  inputWrap: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  inputWrapMulti: { minHeight: 110, alignItems: 'flex-start', paddingTop: 6 },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 10,
    color: TEXT,
    paddingVertical: 0,
    height: 36,
  },
  inputMulti: { height: 100 },
  suffix: { fontFamily: FONT.regular, fontSize: 8, color: '#9A9A9A', marginLeft: 6 },

  selectWrap: { justifyContent: 'space-between' },
  selectText: { fontFamily: FONT.regular, fontSize: 10, color: TEXT, flex: 1 },
  chevron: {
    width: 6,
    height: 6,
    borderRightWidth: 1.3,
    borderBottomWidth: 1.3,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginBottom: 3,
  },
  menu: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 12 },

  checkGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  checkCell: { width: '33.333%', marginBottom: 12, paddingRight: 4 },
  checkItem: { flexDirection: 'row', alignItems: 'center' },
  checkBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#9A9A9A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    backgroundColor: '#FFFFFF',
  },
  checkBoxOn: { backgroundColor: ORANGE, borderColor: ORANGE },
  checkTick: { color: '#FFFFFF', fontSize: 8, lineHeight: 10, fontWeight: '700' },
  checkLabel: { flex: 1, fontFamily: FONT.regular, fontSize: 8, color: TEXT },

  btn: { height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  btnFilled: { backgroundColor: ORANGE },
  btnOutlined: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: ORANGE },
  btnText: { fontFamily: FONT.medium, fontSize: 10, color: '#FFFFFF' },
});
