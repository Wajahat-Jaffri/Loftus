import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { PROPERTY_TYPES } from '../../constants/offersData';
import { COLORS, FONT } from '../listing/ListingControls';

const CARD_H = 133;

/* Figma ChevronDown: 22 x 22 box, the "V" is 11 wide x 6.6 tall */
const ChevronDown = ({ color = '#515151' }) => (
  <View style={styles.chevronBox}>
    <View style={[styles.chevron, { borderColor: color }]} />
  </View>
);

/**
 * Filter popup (Figma "Offers - Filter Popup"):
 * 20% black overlay, white card 345 x 133 (radius 14) centered on the screen,
 * title "Property" 14/500 and a 309 x 50 pill select.
 */
const OfferFilterModal = ({ visible, value, onClose, onSelect }) => {
  const { height } = useWindowDimensions();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={[styles.backdrop, { paddingTop: Math.max(0, (height - CARD_H) / 2) }]} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Property</Text>

          {/* Inline dropdown (no nested Modal) */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.select}
            onPress={() => setOpen((o) => !o)}
          >
            <Text style={styles.selectText}>{value === 'All' ? 'Type' : value}</Text>
            <ChevronDown />
          </TouchableOpacity>

          {open && (
            <View style={styles.dropdown}>
              {PROPERTY_TYPES.map((t, i) => (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.7}
                  style={[styles.option, i !== PROPERTY_TYPES.length - 1 && styles.optionDivider]}
                  onPress={() => {
                    onSelect(t);
                    onClose();
                  }}
                >
                  <Text style={[styles.optionText, t === value && styles.optionTextOn]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  title: {
    height: 21,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#404040',
    includeFontPadding: false,
  },
  select: {
    marginTop: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 50,
    paddingHorizontal: 11, // Figma 12 minus the border
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  selectText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#515151',
    includeFontPadding: false,
  },
  chevronBox: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  chevron: {
    width: 7.8,
    height: 7.8,
    borderRightWidth: 1.6,
    borderBottomWidth: 1.6,
    transform: [{ rotate: '45deg' }, { translateY: -2.4 }],
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  option: { paddingVertical: 12, paddingHorizontal: 16 },
  optionDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  optionText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#515151',
    includeFontPadding: false,
  },
  optionTextOn: { fontFamily: FONT.medium, color: COLORS.orange },
});

export default OfferFilterModal;
