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
import ScreenHeader from '../components/ScreenHeader';
import LeaseCard from '../components/LeaseCard';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const BORDER = '#E7E7E7';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const CHEVRON = require('../assets/icons/ChevronDown.png');
const PLUS = require('../assets/icons/Plus.png');

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

const renderRow = (label, value, style) => (
  <View style={[styles.row, style]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
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

  const historyBtn = (
    <TouchableOpacity
      onPress={() => navigation.navigate('PaymentHistoryScreen')}
      activeOpacity={0.7}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      {ICONS.history ? (
        <Image source={ICONS.history} style={styles.historyIcon} resizeMode="contain" />
      ) : (
        <Text style={styles.historyFallback}>↺</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScreenHeader title="Payments" onBack={() => navigation.goBack()} right={historyBtn} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => setCardMenu(false)}
      >
        <View style={styles.leaseWrap}>
          <LeaseCard lease={lease} />
        </View>

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
            <Text style={[styles.toggleText, method === 'card' ? styles.toggleTextActive : styles.toggleTextOff]}>
              Credit Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.toggleItem, styles.toggleSecond, method === 'bank' && styles.toggleActive]}
            onPress={() => setMethod('bank')}
          >
            <Text style={[styles.toggleText, method === 'bank' ? styles.toggleTextActive : styles.toggleTextOff]}>
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
          <Image source={CHEVRON} style={styles.selectChevron} resizeMode="contain" />
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
          <Image source={PLUS} style={styles.plus} resizeMode="contain" />
          <Text style={styles.addCardText}>Credit Card</Text>
        </TouchableOpacity>

        {/* Totals */}
        <View style={styles.totals}>
          {renderRow('Balance', money(total))}
          {renderRow('Procession Fee', 'Waived', styles.rowGap)}
          <View style={styles.divider} />
          {renderRow('Total Due', money(total), styles.rowGapSmall)}
        </View>

        {/* Card logos */}
        <View style={styles.logos}>
          {ICONS.visa ? (
            <View style={styles.logoBox}>
              <Image source={ICONS.visa} style={styles.visa} resizeMode="contain" />
            </View>
          ) : null}
          {ICONS.mastercard ? (
            <View style={[styles.logoBox, styles.logoGap]}>
              <Image source={ICONS.mastercard} style={styles.master} resizeMode="contain" />
            </View>
          ) : null}
          {/* AMEX is drawn in code, so it always shows */}
          <View style={[styles.logoBox, styles.logoGap, styles.amexBox]}>
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
  content: { paddingHorizontal: 15, paddingBottom: 22 },

  historyIcon: { width: 24, height: 24 },
  historyFallback: { fontSize: 22, color: '#444444' },

  leaseWrap: { marginTop: 24, alignItems: 'stretch' },

  sectionLabel: {
    marginTop: 22.5,
    marginBottom: 6.5,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 22,
    color: '#4B5563',
    includeFontPadding: false,
  },
  amountBox: {
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  dollar: {
    fontFamily: FONT.regular,
    fontSize: 24,
    lineHeight: 32,
    color: '#9CA3AF',
    includeFontPadding: false,
  },
  amountInput: {
    flex: 1,
    height: 44,
    marginLeft: 4,
    padding: 0,
    fontFamily: FONT.medium,
    fontSize: 30,
    color: '#000000',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  toggle: {
    height: 48,
    marginTop: 16,
    padding: 6,
    borderRadius: 50,
    backgroundColor: '#FFF4F1',
    flexDirection: 'row',
  },
  toggleItem: {
    flex: 1,
    height: 36,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: ORANGE },
  toggleText: {
    fontFamily: FONT.semibold,
    fontSize: 10,
    lineHeight: 15,
    includeFontPadding: false,
  },
  toggleTextActive: { color: '#FFFFFF' },
  toggleTextOff: { color: ORANGE, opacity: 0.6 },
  toggleSecond: { marginLeft: 4 },

  select: {
    height: 50,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  selectText: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#4B5563',
    includeFontPadding: false,
  },
  selectChevron: { width: 18, height: 18, tintColor: '#4B5563' },
  selectMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  selectItem: { paddingVertical: 12, paddingHorizontal: 15 },

  addCard: {
    height: 22,
    marginTop: 14,
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plus: { width: 18, height: 18, marginRight: 4 },
  addCardText: {
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 22,
    color: ORANGE,
    includeFontPadding: false,
  },

  totals: { marginTop: 36.5 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowGap: { marginTop: 9 },
  rowGapSmall: { marginTop: 12.5 },
  rowLabel: {
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 22,
    color: '#636D7A',
    includeFontPadding: false,
  },
  rowValue: {
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    includeFontPadding: false,
  },
  divider: { height: 1, marginTop: 12.5, backgroundColor: BORDER },

  logos: {
    marginTop: 29.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logoBox: {
    width: 42,
    height: 24,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoGap: { marginLeft: 8 },
  visa: { width: 27.76, height: 9 },
  master: { width: 23.57, height: 15 },
  amexBox: { backgroundColor: '#006FCF', borderColor: '#006FCF' },
  amexText: {
    fontFamily: FONT.semibold,
    fontSize: 8,
    lineHeight: 12,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    includeFontPadding: false,
  },

  payButton: {
    height: 50,
    marginTop: 18,
    borderRadius: 50,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
