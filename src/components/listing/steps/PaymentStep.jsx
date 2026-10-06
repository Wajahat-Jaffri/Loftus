import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  COLORS,
  FONT,
  AddLink,
  SelectField,
  PrimaryButton,
  CloseIcon,
} from '../ListingControls';

const PaymentStep = ({ cards, selectedCard, onSelect, onAddCard }) => {
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
    <View>
      <Text style={styles.info}>Please choose a stored card for payment</Text>

      <SelectField
        title="Choose card"
        value={selectedCard}
        placeholder="Select card"
        options={cards}
        onSelect={onSelect}
        containerStyle={{ marginBottom: 4 }}
      />

      <AddLink label="Credit Card" onPress={() => setOpen(true)} />

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
  info: { fontFamily: FONT.regular, fontSize: 10, color: COLORS.text, marginBottom: 12, marginTop: 4 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontFamily: FONT.semi, fontSize: 14, color: COLORS.text },
  inputLabel: { fontFamily: FONT.regular, fontSize: 9, color: '#555555', marginBottom: 5, marginLeft: 4 },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: COLORS.text,
    marginBottom: 16,
  },
});

export default PaymentStep;