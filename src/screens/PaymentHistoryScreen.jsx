import React from 'react';
import { View, Text, Image, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { ICONS } from '../assets';
import { PAYMENT_HISTORY } from '../constants/paymentsData';

const ORANGE = '#FF6C40';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const HistoryRow = ({ item }) => {
  if (item.type === 'simple') {
    return (
      <View style={[styles.card, styles.simpleCard]}>
        <Text style={styles.simpleLabel}>{item.label}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>
    );
  }

  if (item.type === 'paidBy') {
    return (
      <View style={[styles.card, styles.paidCard]}>
        <View>
          <Text style={styles.paidLabel}>Paid by:</Text>
          <Text style={styles.payer}>{item.payer}</Text>
        </View>
        <View style={styles.alignEnd}>
          <Text style={styles.amount}>{item.amount}</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeText}>{item.fee}</Text>
            <Image source={ICONS.info} style={styles.infoGrey} resizeMode="contain" />
          </View>
        </View>
      </View>
    );
  }

  // adjusted
  return (
    <View style={[styles.card, styles.adjustedCard]}>
      <View style={styles.adjustedTop}>
        <Text style={styles.adjustedLabel}>{`Paid by:\n${item.payer}`}</Text>
        <View style={styles.adjustedRight}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
            <Image source={ICONS.info} style={styles.infoRed} resizeMode="contain" />
          </View>
          <Text style={styles.adjustedAmount}>{item.amount}</Text>
        </View>
      </View>
    </View>
  );
};

const PaymentHistoryScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <ScreenHeader title="Payment History" onBack={() => navigation.goBack()} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {PAYMENT_HISTORY.map((item, i) => (
        <View key={item.id} style={i > 0 ? styles.gap : null}>
          <HistoryRow item={item} />
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 15, paddingTop: 20, paddingBottom: 24 },
  gap: { marginTop: 16 },

  card: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignEnd: { alignItems: 'flex-end' },

  simpleCard: { height: 58, alignItems: 'center' },
  simpleLabel: {
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },
  amount: {
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },

  paidCard: { height: 70, paddingVertical: 10 },
  paidLabel: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#404040',
    includeFontPadding: false,
  },
  payer: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },
  feeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  feeText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#404040',
    includeFontPadding: false,
  },
  infoGrey: { width: 14, height: 14, marginLeft: 3, tintColor: '#404040' },

  adjustedCard: { height: 102, paddingTop: 15 },
  adjustedTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  adjustedLabel: {
    width: 167,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    includeFontPadding: false,
  },
  adjustedRight: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  adjustedAmount: {
    marginLeft: 6,
    fontFamily: FONT.semibold,
    fontSize: 16,
    lineHeight: 24,
    color: ORANGE,
    includeFontPadding: false,
  },
  discountBadge: {
    minWidth: 66,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#FFDDDD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#AA0303',
    includeFontPadding: false,
  },
  infoRed: { width: 12, height: 12, marginLeft: 3, tintColor: '#AA0303' },
});
