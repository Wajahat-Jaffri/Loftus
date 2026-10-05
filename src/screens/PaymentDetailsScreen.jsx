import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import LeaseCard from '../components/LeaseCard';
import { SelectField } from '../components/FormControls';
import { ICONS } from '../assets';
import { LEASES, SAVED_CARDS, SAVED_BANKS } from '../constants/paymentsData';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const money = (n) => `$${n.toFixed(2)}`;

const SummaryRow = ({ label, value, bold }) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && styles.summaryBold]}>{label}</Text>
    <Text style={[styles.summaryValue, bold && styles.summaryBold]}>{value}</Text>
  </View>
);

const AmexLogo = () => (
  <View style={styles.amexBox}>
    <Image source={ICONS.amex} style={styles.amexText} resizeMode="contain" />
  </View>
);

const PaymentDetailsScreen = ({ navigation, route }) => {
  const lease = (route && route.params && route.params.lease) || LEASES[0];

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Credit Card'); // 'Credit Card' | 'Bank Account'
  const [cards, setCards] = useState(SAVED_CARDS);
  const [banks, setBanks] = useState(SAVED_BANKS);
  const [selectedCard, setSelectedCard] = useState(SAVED_CARDS[0]);
  const [selectedBank, setSelectedBank] = useState(SAVED_BANKS[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [newNumber, setNewNumber] = useState('');

  const isCard = method === 'Credit Card';
  const numeric = parseFloat(amount) || 0;

  const onChangeAmount = (v) => {
    // digits and a single dot, max 2 decimals
    const clean = v.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    const next = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}` : clean;
    setAmount(next);
  };

  const addMethod = () => {
    const digits = newNumber.replace(/\D/g, '');
    if (digits.length < (isCard ? 12 : 6)) {
      Alert.alert('Invalid number', `Please enter a valid ${isCard ? 'card' : 'account'} number.`);
      return;
    }
    const masked = `************${digits.slice(-4)}`;
    if (isCard) {
      setCards((p) => (p.includes(masked) ? p : [...p, masked]));
      setSelectedCard(masked);
    } else {
      setBanks((p) => (p.includes(masked) ? p : [...p, masked]));
      setSelectedBank(masked);
    }
    setNewNumber('');
    setShowAdd(false);
  };

  const payNow = () => {
    if (numeric <= 0) return Alert.alert('Enter amount', 'Please enter the amount you want to pay.');
    if (numeric > lease.balance) {
      return Alert.alert('Amount too high', `The amount cannot be more than the balance (${money(lease.balance)}).`);
    }
    // TODO: call payment API here
    Alert.alert('Payment successful', `${money(numeric)} paid for ${lease.title}.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScreenHeader
        title="Payments"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            onPress={() => navigation.navigate('PaymentHistoryScreen')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={ICONS.history} style={styles.historyIcon} resizeMode="contain" />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LeaseCard lease={lease} />

          <Text style={styles.sectionLabel}>Pay Balance</Text>
          <View style={styles.amountBox}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={onChangeAmount}
              placeholder="0"
              placeholderTextColor="#C4C4C4"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Credit Card / Bank Account toggle */}
          <View style={styles.segment}>
            {['Credit Card', 'Bank Account'].map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.segmentItem, method === m && styles.segmentActive]}
                activeOpacity={0.85}
                onPress={() => setMethod(m)}
              >
                <Text style={[styles.segmentText, method === m && styles.segmentTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <SelectField
            value={isCard ? selectedCard : selectedBank}
            options={isCard ? cards : banks}
            onSelect={isCard ? setSelectedCard : setSelectedBank}
            placeholder="Select"
          />

          <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.addBtn}>
            <Text style={styles.addText}>+ {isCard ? 'Credit Card' : 'Bank Account'}</Text>
          </TouchableOpacity>

          <View style={styles.summary}>
            <SummaryRow label="Balance" value={money(numeric)} />
            <SummaryRow label="Procession Fee" value="Waived" />
            <View style={styles.summaryDivider} />
            <SummaryRow label="Total Due" value={money(numeric)} />
          </View>

          <View style={styles.logos}>
            <Image source={ICONS.visa} style={styles.visa} resizeMode="contain" />
            <Image source={ICONS.mastercard} style={styles.mastercard} resizeMode="contain" />
            <AmexLogo />
          </View>

          <TouchableOpacity style={styles.payBtn} activeOpacity={0.85} onPress={payNow}>
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Add card / bank modal */}
      <Modal visible={showAdd} transparent statusBarTranslucent animationType="fade" onRequestClose={() => setShowAdd(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowAdd(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add {isCard ? 'Credit Card' : 'Bank Account'}</Text>
            <TextInput
              style={styles.modalInput}
              value={newNumber}
              onChangeText={setNewNumber}
              placeholder={isCard ? 'Card number' : 'Account number'}
              placeholderTextColor="#C4C4C4"
              keyboardType="number-pad"
              maxLength={19}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalOutline]} onPress={() => setShowAdd(false)}>
                <Text style={[styles.modalBtnText, { color: ORANGE }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalFilled]} onPress={addMethod}>
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Add</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  historyIcon: { width: 20, height: 20 },

  sectionLabel: { fontFamily: FONT.medium, fontSize: 10, color: TEXT, marginTop: 4, marginBottom: 8 },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  dollar: { fontFamily: FONT.regular, fontSize: 18, color: '#B0B0B0', marginRight: 8 },
  amountInput: { flex: 1, fontFamily: FONT.medium, fontSize: 20, color: '#000000', paddingVertical: 0 },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#FFEFEA',
    borderRadius: 20,
    padding: 3,
    marginBottom: 14,
  },
  segmentItem: { flex: 1, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: ORANGE },
  segmentText: { fontFamily: FONT.regular, fontSize: 8, color: '#FFA58C' },
  segmentTextActive: { fontFamily: FONT.medium, color: '#FFFFFF' },

  addBtn: { alignSelf: 'flex-start', marginTop: 2, marginBottom: 16 },
  addText: { fontFamily: FONT.regular, fontSize: 10, color: ORANGE },

  summary: { marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
  summaryValue: { fontFamily: FONT.medium, fontSize: 9, color: '#000000' },
  summaryBold: { fontFamily: FONT.medium, fontSize: 10 },
  summaryDivider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 4 },

  logos: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 14 },
  visa: { width: 28, height: 10, marginRight: 10 },
  mastercard: { width: 24, height: 15, marginRight: 10 },
  amexBox: {
    width: 26,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#2E77BB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amexText: { width: 20, height: 6 },

  payBtn: {
    height: 44,
    borderRadius: 22,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: { fontFamily: FONT.medium, fontSize: 12, color: '#FFFFFF' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 },
  modalTitle: { fontFamily: FONT.semibold, fontSize: 14, color: TEXT, marginBottom: 12 },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: TEXT,
    paddingVertical: 0,
  },
  modalBtns: { flexDirection: 'row', marginTop: 16 },
  modalBtn: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  modalOutline: { borderWidth: 1, borderColor: ORANGE, marginRight: 8 },
  modalFilled: { backgroundColor: ORANGE, marginLeft: 8 },
  modalBtnText: { fontFamily: FONT.medium, fontSize: 12 },
});
