import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ICONS } from '../assets';

export const ORANGE = '#FF6C40';
export const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};

const caretDown = require('../assets/icons/CaretDown.png');

/* ------------------------------------------------------------------ */
/* Section title: Poppins 16/500, line 24, black                       */
/* ------------------------------------------------------------------ */
export const SectionTitle = ({ children, style }) => (
  <Text style={[styles.sectionTitle, style]}>{children}</Text>
);

/* ------------------------------------------------------------------ */
/* Label (12/400 #6A6A6A, padding 0 4) + 343x48 pill field              */
/* ------------------------------------------------------------------ */
const FieldShell = ({ label, children, style, bio }) => (
  <View style={[styles.fieldWrap, style]}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.field, bio && styles.fieldBio]}>{children}</View>
  </View>
);

export const ProfileField = ({
  label,
  value,
  onChangeText,
  placeholder,
  readOnly,
  rightText,
  onRightPress,
  rightIcon,
  leftIcon,
  multiline,
  style,
  ...rest
}) => (
  <FieldShell label={label} style={style} bio={multiline}>
    {leftIcon ? (
      <Image source={leftIcon} style={styles.leftIcon} resizeMode="contain" />
    ) : null}
    <TextInput
      style={[styles.input, multiline && styles.inputBio]}
      value={value}
      onChangeText={onChangeText}
      editable={!readOnly}
      placeholder={placeholder}
      placeholderTextColor="#C2C2C2"
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      {...rest}
    />
    {rightText ? (
      <TouchableOpacity onPress={onRightPress} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={styles.rightText}>{rightText}</Text>
      </TouchableOpacity>
    ) : null}
    {rightIcon || null}
  </FieldShell>
);

/* ------------------------------------------------------------------ */
/* Dropdown field (value 14/400 #404040, placeholder #C2C2C2, caret)    */
/* ------------------------------------------------------------------ */
export const ProfileSelect = ({ label, value, placeholder = 'Select', options, onSelect, style }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <FieldShell label={label} style={style}>
        <TouchableOpacity style={styles.selectRow} activeOpacity={0.8} onPress={() => setOpen(true)}>
          <Text style={[styles.selectText, !value && { color: '#C2C2C2' }]} numberOfLines={1}>
            {value || placeholder}
          </Text>
          <Image source={caretDown} style={styles.caret} resizeMode="contain" />
        </TouchableOpacity>
      </FieldShell>

      <Modal visible={open} transparent statusBarTranslucent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.pickerCard} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.pickerRow}
                  onPress={() => {
                    onSelect(opt);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.pickerText, opt === value && { color: ORANGE, fontFamily: FONT.medium }]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Save button: 345x50, orange, Poppins 14/500 white                    */
/* ------------------------------------------------------------------ */
export const SaveButton = ({ title = 'Save', onPress, style }) => (
  <TouchableOpacity style={[styles.saveBtn, style]} activeOpacity={0.85} onPress={onPress}>
    <Text style={styles.saveText}>{title}</Text>
  </TouchableOpacity>
);

/* ------------------------------------------------------------------ */
/* Segmented control: 343x50, 3 equal white segments, 11/16 text         */
/* ------------------------------------------------------------------ */
export const SegmentedTabs = ({ tabs, active, onChange }) => (
  <View style={styles.seg}>
    {tabs.map((t) => {
      const on = t === active;
      return (
        <TouchableOpacity key={t} style={styles.segItem} activeOpacity={0.8} onPress={() => onChange(t)}>
          <Text style={[styles.segText, on && styles.segTextOn]}>{t}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

/* ------------------------------------------------------------------ */
/* Profile card used on Edit Profile (centered / compact)               */
/* 343x164, border 1 #E9E9E9, radius 12; badge 32x32 pencil              */
/* ------------------------------------------------------------------ */
export const EditAvatarCard = ({ compact, source, onPressEdit }) => (
  <View style={styles.card}>
    <Image source={source} style={[styles.avatar, { left: compact ? 15 : 105 }]} />
    <TouchableOpacity
      style={[styles.badge, { left: compact ? 114 : 204 }]}
      onPress={onPressEdit}
      activeOpacity={0.8}
    >
      <Image source={ICONS.pencilSimple} style={styles.badgeIcon} resizeMode="contain" />
    </TouchableOpacity>
    {compact ? (
      <View style={styles.cardText}>
        <Text style={styles.cardName}>Jerry Helfer</Text>
        <Text style={styles.cardRole}>Landlord</Text>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },

  /* fields */
  fieldWrap: { width: 343 },
  label: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#6A6A6A',
    paddingHorizontal: 4,
    marginBottom: 4,
    includeFontPadding: false,
  },
  field: {
    height: 48,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#C2C2C2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldBio: {
    height: 212,
    borderRadius: 24,
    alignItems: 'flex-start',
  },
  leftIcon: { width: 16, height: 16, marginRight: 8, tintColor: '#404040' },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: '#404040',
    includeFontPadding: false,
  },
  inputBio: { alignSelf: 'stretch', paddingTop: 14, paddingBottom: 14 },
  rightText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: ORANGE,
    marginLeft: 8,
    includeFontPadding: false,
  },
  selectRow: { flex: 1, height: 46, flexDirection: 'row', alignItems: 'center' },
  selectText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#404040',
    includeFontPadding: false,
  },
  caret: { width: 20, height: 20, marginLeft: 8 },

  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pickerCard: {
    maxHeight: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  pickerRow: { paddingHorizontal: 24, paddingVertical: 12 },
  pickerText: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#404040',
    includeFontPadding: false,
  },

  /* save */
  saveBtn: {
    width: 345,
    height: 50,
    borderRadius: 50,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  saveText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  /* segmented */
  seg: { width: 343, height: 50, flexDirection: 'row', backgroundColor: '#FFFFFF' },
  segItem: { flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', padding: 10 },
  segText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#515151',
    includeFontPadding: false,
  },
  segTextOn: { fontFamily: FONT.semi, color: ORANGE },

  /* card */
  card: {
    width: 343,
    height: 164,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    backgroundColor: '#FFFFFF',
  },
  avatar: { position: 'absolute', top: 15, width: 132, height: 132, borderRadius: 66 },
  badge: {
    position: 'absolute',
    top: 108,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { width: 24, height: 24, tintColor: ORANGE },
  cardText: { position: 'absolute', left: 179, top: 54.5, width: 117 },
  cardName: {
    fontFamily: FONT.semi,
    fontSize: 20,
    lineHeight: 30,
    color: '#000000',
    includeFontPadding: false,
  },
  cardRole: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#000000',
    marginTop: 2,
    includeFontPadding: false,
  },
});
