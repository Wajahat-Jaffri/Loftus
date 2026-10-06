import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { PROPERTY_TYPES } from '../../constants/offersData';
import { COLORS, FONT, Chevron } from '../listing/ListingControls';

const OfferFilterModal = ({ visible, value, onClose, onSelect }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Property</Text>

          {/* Inline dropdown (no nested Modal) */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.select}
            onPress={() => setOpen((o) => !o)}
          >
            <Text style={[styles.selectText, value === 'All' && { color: COLORS.text }]}>
              {value === 'All' ? 'Type' : value}
            </Text>
            <Chevron />
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 140,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    elevation: 6,
  },
  title: { fontFamily: FONT.medium, fontSize: 11, color: COLORS.text, marginBottom: 10 },
  select: {
    height: 38,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectText: { flex: 1, fontFamily: FONT.regular, fontSize: 10, color: COLORS.text },
  dropdown: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  option: { paddingVertical: 11, paddingHorizontal: 16 },
  optionDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  optionText: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.text },
  optionTextOn: { fontFamily: FONT.medium, color: COLORS.orange },
});

export default OfferFilterModal;