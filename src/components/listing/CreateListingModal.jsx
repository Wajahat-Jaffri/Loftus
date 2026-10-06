import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { USER_PROPERTIES } from '../../constants/listingData';
import {
  COLORS,
  FONT,
  PrimaryButton,
  CloseIcon,
  Chevron,
} from './ListingControls';

const CreateListingModal = ({ visible, onClose, onSelectType }) => {
  const [propertyLabel, setPropertyLabel] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const reset = () => {
    setPropertyLabel('');
    setDropdownOpen(false);
  };

  const close = () => {
    reset();
    onClose?.();
  };

  const choose = (type) => {
    const property = USER_PROPERTIES.find((p) => p.label === propertyLabel);
    reset();
    onSelectType?.(type, property);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Create listing for</Text>
            <TouchableOpacity
              onPress={close}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CloseIcon size={14} />
            </TouchableOpacity>
          </View>

          {/* Inline dropdown (no nested Modal) */}
          <TouchableOpacity
            style={styles.select}
            activeOpacity={0.8}
            onPress={() => setDropdownOpen((o) => !o)}
          >
            <Text
              numberOfLines={1}
              style={[styles.selectText, !propertyLabel && { color: COLORS.grey }]}
            >
              {propertyLabel || 'Select...'}
            </Text>
            <Chevron />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdown}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                {USER_PROPERTIES.map((p, i) => (
                  <TouchableOpacity
                    key={p.id}
                    activeOpacity={0.7}
                    style={[
                      styles.option,
                      i !== USER_PROPERTIES.length - 1 && styles.optionDivider,
                    ]}
                    onPress={() => {
                      setPropertyLabel(p.label);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        p.label === propertyLabel && styles.optionTextSelected,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {!!propertyLabel && !dropdownOpen && (
            <View style={styles.buttonsRow}>
              <PrimaryButton
                label="Sale"
                color={COLORS.orange}
                style={styles.btn}
                onPress={() => choose('Sale')}
              />
              <PrimaryButton
                label="Rent"
                color={COLORS.blue}
                style={styles.btn}
                onPress={() => choose('Rent')}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontFamily: FONT.semi, fontSize: 14, color: COLORS.text },

  select: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectText: { flex: 1, fontFamily: FONT.regular, fontSize: 12, color: COLORS.text },

  dropdown: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  option: { paddingVertical: 12, paddingHorizontal: 12 },
  optionDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  optionText: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.text },
  optionTextSelected: { fontFamily: FONT.medium, color: COLORS.orange },

  buttonsRow: { flexDirection: 'row', marginTop: 14 },
  btn: { flex: 1, marginHorizontal: 5, height: 40, borderRadius: 20 },
});

export default CreateListingModal;