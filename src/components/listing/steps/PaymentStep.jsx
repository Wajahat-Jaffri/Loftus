import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT, AddLink, PrimaryButton, CloseIcon } from '../ListingControls';

const CHEVRON_PNG = require('../../../assets/icons/ChevronDown.png');

/*
 * Figma: hint text 16px (46px under the stepper), card row 345 x 50 (radius 15, border #E7E7E7)
 * 20px under it, "+ Credit Card" 16px under the row, right aligned.
 * textColor: Sale #202020, Rent #505050.
 */
const PaymentStep = ({ cards, selectedCard, onSelect, onAddCard, textColor = '#202020' }) => {
  const [pick, setPick] = useState(false);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState('');

  const saveCard = () => {
    if (number.length < 13) {
      Alert.alert('Invalid card', 'Please enter a valid card number.');
      return;
    }
    // TODO: send the card to your payment provider (Stripe etc.) instead of storing it locally.
    const masked = `${'*'.repeat(12)}${number.slice(-4)}`;
    if (!cards.includes(masked)) onAddCard(masked);
    onSelect(masked);
    setNumber('');
    setOpen(false);
  };

  return (
    <View style={{ marginTop: 46 }}>
      <Text style={[styles.info, { color: textColor }]}>Please choose a stored card for payment</Text>

      <TouchableOpacity activeOpacity={0.8} style={styles.cardRow} onPress={() => setPick(true)}>
        <Text style={styles.cardText} numberOfLines={1}>
          {selectedCard || 'Select card'}
        </Text>
        <View style={styles.chevronBox}>
          <Image source={CHEVRON_PNG} style={styles.chevron} resizeMode="contain" />
        </View>
      </TouchableOpacity>

      <AddLink label="Credit Card" style={{ marginTop: 16 }} onPress={() => setOpen(true)} />

      {/* stored cards */}
      <Modal visible={pick} transparent animationType="fade" onRequestClose={() => setPick(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setPick(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Choose card</Text>
            <FlatList
              data={cards}
              keyExtractor={(c) => c}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(item);
                    setPick(false);
                  }}
                >
                  <Text style={[styles.optionText, item === selectedCard && styles.optionOn]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* add card */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Add credit card</Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon size={14} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Card number</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={(t) => setNumber(t.replace(/\D/g, '').slice(0, 16))}
              keyboardType="number-pad"
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={COLORS.placeholder}
            />

            <PrimaryButton label="Add card" onPress={saveCard} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    marginLeft: 5,
    height: 15,
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 15,
    includeFontPadding: false,
  },
  cardRow: {
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  cardText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#4B5563',
    includeFontPadding: false,
  },
  chevronBox: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  chevron: { width: 12.3, height: 12.3, tintColor: '#4B5563' },

  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '55%',
  },
  sheetTitle: { fontFamily: FONT.semi, fontSize: 14, color: COLORS.text, marginBottom: 8 },
  optionRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  optionText: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.text },
  optionOn: { fontFamily: FONT.medium, color: COLORS.orange },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontFamily: FONT.semi, fontSize: 18, color: COLORS.text },
  inputLabel: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.label,
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    borderRadius: 50,
    paddingHorizontal: 16,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.fieldText,
    marginBottom: 16,
  },
});

export default PaymentStep;
