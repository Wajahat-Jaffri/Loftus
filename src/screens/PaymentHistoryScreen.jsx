import React from 'react';
import { View, Text, Image, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { ICONS } from '../assets';
import { PAYMENT_HISTORY } from '../constants/paymentsData';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
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
        <Text style={styles.simpleAmount}>{item.amount}</Text>
      </View>
    );
  }

  if (item.type === 'paidBy') {
    return (
      <View style={[styles.card, styles.paidCard]}>
        <View>
          <Text style={styles.paidLabel}>Paid by:</Text>
          <Text style={styles.paidLabel}>{item.payer}</Text>
        </View>
        <View style={styles.alignEnd}>
          <Text style={styles.paidAmount}>{item.amount}</Text>
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
      <Text style={styles.adjustedLabel}>Paid by: {item.payer}</Text>
      <View style={styles.adjustedRight}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
          <Image source={ICONS.info} style={styles.infoRed} resizeMode="contain" />
        </View>
        <Text style={styles.adjustedAmount}>{item.amount}</Text>
      </View>
    </View>
  );
};

const PaymentHistoryScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <ScreenHeader title="Payment History" onBack={() => navigation.goBack()} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {PAYMENT_HISTORY.map((item) => (
        <HistoryRow key={item.id} item={item} />
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },

  card: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  alignEnd: { alignItems: 'flex-end' },

  simpleCard: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  simpleLabel: { fontFamily: FONT.regular, fontSize: 10, color: TEXT },
  simpleAmount: { fontFamily: FONT.medium, fontSize: 10, color: '#000000' },

  paidCard: { paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' },
  paidLabel: { fontFamily: FONT.regular, fontSize: 10, color: TEXT, lineHeight: 15 },
  paidAmount: { fontFamily: FONT.medium, fontSize: 10, color: '#000000' },
  feeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  feeText: { fontFamily: FONT.regular, fontSize: 7, color: '#6B6B6B' },
  infoGrey: { width: 7, height: 7, marginLeft: 3, tintColor: '#6B6B6B' },

  adjustedCard: {
    minHeight: 64,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adjustedLabel: { width: 90, fontFamily: FONT.medium, fontSize: 10, color: '#000000', lineHeight: 15 },
  adjustedRight: { flexDirection: 'row', alignItems: 'flex-start' },
  adjustedAmount: { fontFamily: FONT.semibold, fontSize: 10, color: ORANGE, marginLeft: 8, marginTop: 1 },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE3E3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: { fontFamily: FONT.medium, fontSize: 7, color: '#E04848' },
  infoRed: { width: 7, height: 7, marginLeft: 3, tintColor: '#E04848' },
});
