import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const PLACEHOLDER = '#C4C4C4';
const BORDER = '#E6E6E6';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

export const ChevronDown = () => <View style={styles.chevronDown} />;

/** Labeled text field. `rightText` shows an orange action (e.g. "Edit"); `readOnly` locks the input. */
export const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  readOnly,
  rightText,
  onRightPress,
  rightIcon,
  multiline,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'sentences',
  style,
}) => (
  <View style={[styles.fieldWrap, style]}>
    {!!label && <Text style={styles.label}>{label}</Text>}
    <View style={[styles.inputBox, multiline && styles.inputBoxMulti]}>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER}
        editable={!readOnly}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {!!rightText && (
        <TouchableOpacity onPress={onRightPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.rightText}>{rightText}</Text>
        </TouchableOpacity>
      )}
      {rightIcon || null}
    </View>
  </View>
);

/** Dropdown that opens a simple option list modal. */
export const SelectField = ({ label, value, options, onSelect, placeholder = 'Select' }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.inputBox} activeOpacity={0.8} onPress={() => setOpen(true)}>
        <Text style={[styles.input, styles.selectText, !value && { color: PLACEHOLDER }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <ChevronDown />
      </TouchableOpacity>

      <Modal visible={open} transparent statusBarTranslucent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.optionsCard}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, item === value && { color: ORANGE, fontFamily: FONT.medium }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export const PrimaryButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={onPress}>
    <Text style={styles.primaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fieldWrap: { marginBottom: 12 },
  label: { fontFamily: FONT.regular, fontSize: 10, color: TEXT, marginBottom: 5 },
  inputBox: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  inputBoxMulti: { minHeight: 120, alignItems: 'flex-start', paddingTop: 6 },
  input: { flex: 1, fontFamily: FONT.regular, fontSize: 11, color: TEXT, paddingVertical: 0, height: 40 },
  inputMulti: { height: 110, paddingTop: 6 },
  selectText: { lineHeight: 40 },
  rightText: { fontFamily: FONT.medium, fontSize: 10, color: ORANGE, marginLeft: 8 },

  chevronDown: {
    width: 7,
    height: 7,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginBottom: 3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  optionsCard: { backgroundColor: '#FFFFFF', borderRadius: 12, maxHeight: 320, paddingVertical: 6 },
  option: { paddingVertical: 12, paddingHorizontal: 16 },
  optionText: { fontFamily: FONT.regular, fontSize: 13, color: TEXT },

  primaryBtn: {
    height: 44,
    borderRadius: 22,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  primaryBtnText: { fontFamily: FONT.medium, fontSize: 13, color: '#FFFFFF' },
});
