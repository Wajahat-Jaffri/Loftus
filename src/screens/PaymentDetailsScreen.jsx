import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LeaseCard from '../components/LeaseCard';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const BORDER = '#E6E6E6';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

// Used only if the screen is opened without a lease.
const DEFAULT_LEASE = {
  id: 'default',
  title: 'Woodland Apartment',
  address: '1012 Ocean avenue, New York, USA',
  balance: '600',
  dueDate: '03/06/2025',
  status: 'Active',
};

const CARDS = ['**************4242', '**************1881'];

const money = (n) => `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;

const Row = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, bold && styles.rowBold]}>{label}</Text>
    <Text style={[styles.rowValue, bold && styles.rowBold]}>{value}</Text>
  </View>
);

const PaymentDetailsScreen = ({ navigation, route }) => {
  const lease = route?.params?.lease ?? DEFAULT_LEASE;

  const [amount, setAmount] = useState('5');
  const [method, setMethod] = useState('card'); // 'card' | 'bank'
  const [card, setCard] = useState(CARDS[0]);
  const [cardMenu, setCardMenu] = useState(false);

  const value = parseFloat(amount);
  const total = Number.isFinite(value) ? value : 0;

  const handleAmount = (t) => {
    // digits and one dot only
    const clean = t.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setAmount(clean);
  };

  const handlePay = () => {
    if (total <= 0) {
      Alert.alert('Enter amount', 'Please enter an amount greater than $0.');
      return;
    }
    Alert.alert('Payment successful', `${money(total)} paid for ${lease.title}.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('PaymentHistoryScreen')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {ICONS.history ? (
            <Image source={ICONS.history} style={styles.historyIcon} resizeMode="contain" />
          ) : (
            <Text style={styles.historyFallback}>↺</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => setCardMenu(false)}
      >
        <LeaseCard lease={lease} />

        <Text style={styles.sectionLabel}>Pay Balance</Text>
        <View style={styles.amountBox}>
          <Text style={styles.dollar}>$</Text>
          <TextInput
            value={amount}
            onChangeText={handleAmount}
            keyboardType="decimal-pad"
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor="#B5B5B5"
          />
        </View>

        {/* Credit Card / Bank Account */}
        <View style={styles.toggle}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.toggleItem, method === 'card' && styles.toggleActive]}
            onPress={() => setMethod('card')}
          >
            <Text style={[styles.toggleText, method === 'card' && styles.toggleTextActive]}>
              Credit Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.toggleItem, method === 'bank' && styles.toggleActive]}
            onPress={() => setMethod('bank')}
          >
            <Text style={[styles.toggleText, method === 'bank' && styles.toggleTextActive]}>
              Bank Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card selector */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.select}
          onPress={() => setCardMenu((o) => !o)}
        >
          <Text style={styles.selectText}>{card}</Text>
          <View style={styles.chevronDown} />
        </TouchableOpacity>
        {cardMenu && (
          <View style={styles.selectMenu}>
            {CARDS.map((c) => (
              <TouchableOpacity
                key={c}
                style={styles.selectItem}
                onPress={() => {
                  setCard(c);
                  setCardMenu(false);
                }}
              >
                <Text style={[styles.selectText, c === card && { color: ORANGE }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addCard}
          onPress={() => Alert.alert('Add card', 'Add card form will open here.')}
        >
          <Text style={styles.plus}>+</Text>
          <Text style={styles.addCardText}>Credit Card</Text>
        </TouchableOpacity>

        {/* Totals */}
        <View style={styles.totals}>
          <Row label="Balance" value={money(total)} />
          <Row label="Procession Fee" value="Waived" />
          <View style={styles.divider} />
          <Row label="Total Due" value={money(total)} />
        </View>

        {/* Card logos */}
        <View style={styles.logos}>
          {ICONS.visa ? <Image source={ICONS.visa} style={styles.logo} resizeMode="contain" /> : null}
          {ICONS.mastercard ? (
            <Image source={ICONS.mastercard} style={styles.logo} resizeMode="contain" />
          ) : null}
          {/* AMEX is drawn in code, so it always shows (the PNG file was not visible) */}
          <View style={styles.amexBox}>
            <Text style={styles.amexText}>AMEX</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 14, color: TEXT },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  historyIcon: { width: 20, height: 20 },
  historyFallback: { fontSize: 20, color: TEXT },

  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 },

  sectionLabel: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: TEXT,
    marginTop: 8,
    marginBottom: 8,
  },
  amountBox: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  dollar: { fontFamily: FONT.regular, fontSize: 16, color: '#9A9A9A', marginRight: 6 },
  amountInput: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 18,
    color: '#000000',
    paddingVertical: 0,
  },

  toggle: {
    flexDirection: 'row',
    height: 34,
    backgroundColor: '#FFF0EB',
    borderRadius: 17,
    padding: 3,
    marginTop: 16,
  },
  toggleItem: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  toggleActive: { backgroundColor: ORANGE },
  toggleText: { fontFamily: FONT.regular, fontSize: 8, color: '#F5A38C' },
  toggleTextActive: { fontFamily: FONT.medium, color: '#FFFFFF' },

  select: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 14,
  },
  selectText: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
  chevronDown: {
    width: 6,
    height: 6,
    borderRightWidth: 1.3,
    borderBottomWidth: 1.3,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginBottom: 3,
  },
  selectMenu: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
  },
  selectItem: { paddingVertical: 10, paddingHorizontal: 12 },

  addCard: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  plus: { fontFamily: FONT.regular, fontSize: 14, color: ORANGE, marginRight: 4 },
  addCardText: { fontFamily: FONT.regular, fontSize: 10, color: ORANGE },

  totals: { marginTop: 22 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: { fontFamily: FONT.regular, fontSize: 10, color: TEXT },
  rowValue: { fontFamily: FONT.medium, fontSize: 10, color: '#000000' },
  rowBold: { fontFamily: FONT.medium },
  divider: { height: 1, backgroundColor: BORDER, marginBottom: 12 },

  logos: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  logo: { width: 26, height: 16, marginLeft: 10 },
  amexBox: {
    width: 26,
    height: 16,
    marginLeft: 10,
    borderRadius: 2,
    backgroundColor: '#1F72CD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amexText: { fontFamily: FONT.semibold, fontSize: 6, color: '#FFFFFF', letterSpacing: 0.3 },

  payButton: {
    height: 44,
    borderRadius: 22,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  payText: { fontFamily: FONT.medium, fontSize: 11, color: '#FFFFFF' },
});
