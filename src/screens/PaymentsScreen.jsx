import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import LeaseCard from '../components/LeaseCard';
import { ICONS } from '../assets';
import { LEASES, SERVICES } from '../constants/paymentsData';

const ORANGE = '#FF6C40';
const BORDER = '#E7E7E7';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const STATUS_OPTIONS = ['Active', 'Expired'];
const CHEVRON = require('../assets/icons/ChevronDown.png');

// Figma service card: 345 x 85, border 1 #E7E7E7, radius 15, padding 16
const ServiceCard = ({ item }) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceTop}>
      <Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>
      <View style={styles.serviceRight}>
        {!!item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
            <Image source={ICONS.info} style={styles.infoIcon} resizeMode="contain" />
          </View>
        )}
        <Text style={styles.servicePrice}>{item.amount}</Text>
      </View>
    </View>
    <Text style={styles.serviceDate}>{item.date}</Text>
  </View>
);

const PaymentsScreen = ({ navigation }) => {
  const [tab, setTab] = useState('Leases');
  const [status, setStatus] = useState('Active');
  const [menuOpen, setMenuOpen] = useState(false);

  const leases = useMemo(() => LEASES.filter((l) => l.status === status), [status]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScreenHeader title="Payments" onBack={() => navigation.goBack()} />

      {/* Tabs + status filter */}
      <View style={styles.tabRow}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.tab, tab === 'Leases' && styles.tabActive]}
            activeOpacity={0.8}
            onPress={() => { setTab('Leases'); setMenuOpen(false); }}
          >
            <Text style={[styles.tabText, tab === 'Leases' && styles.tabTextActive]}>
              {tab === 'Leases' ? `Leases (${leases.length})` : 'Leases'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'Services' && styles.tabActive]}
            activeOpacity={0.8}
            onPress={() => { setTab('Services'); setMenuOpen(false); }}
          >
            <Text style={[styles.tabText, tab === 'Services' && styles.tabTextActive]}>Services</Text>
          </TouchableOpacity>
        </View>

        {tab === 'Leases' && (
          <View style={styles.statusWrap}>
            <Text style={styles.statusLabel}>Status:</Text>
            <TouchableOpacity
              style={styles.statusPill}
              activeOpacity={0.8}
              onPress={() => setMenuOpen((o) => !o)}
            >
              <Text style={styles.statusPillText}>{status}</Text>
              <Image source={CHEVRON} style={styles.chevron} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setMenuOpen(false)}
      >
        {tab === 'Leases'
          ? leases.map((lease, i) => (
              <View key={lease.id} style={i > 0 ? styles.gap : null}>
                <LeaseCard
                  lease={lease}
                  onPress={() => navigation.navigate('PaymentDetailsScreen', { lease })}
                />
              </View>
            ))
          : SERVICES.map((s, i) => (
              <View key={s.id} style={i > 0 ? styles.gap : null}>
                <ServiceCard item={s} />
              </View>
            ))}
      </ScrollView>

      {/* Status menu: rendered at screen level so taps work on Android */}
      {menuOpen && tab === 'Leases' && (
        <>
          <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={styles.menu}>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.menuItem}
                onPress={() => { setStatus(opt); setMenuOpen(false); }}
              >
                <Text
                  style={[
                    styles.menuText,
                    opt === status && { color: ORANGE, fontFamily: FONT.medium },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  tabRow: {
    marginTop: 3,
    marginHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segment: { width: 182, height: 50, flexDirection: 'row' },
  tab: {
    width: 91,
    height: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: ORANGE },
  tabText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.22,
    color: '#515151',
    includeFontPadding: false,
  },
  tabTextActive: { fontFamily: FONT.semibold, color: ORANGE },

  statusWrap: { flexDirection: 'row', alignItems: 'center' },
  statusLabel: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#515151',
    marginRight: 4,
    includeFontPadding: false,
  },
  statusPill: {
    height: 34,
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPillText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#515151',
    includeFontPadding: false,
  },
  chevron: { width: 14, height: 14, tintColor: '#515151' },

  menu: {
    position: 'absolute',
    top: 52 + 3 + 50 - 6,
    right: 16,
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 14 },
  menuText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#515151',
    includeFontPadding: false,
  },

  content: { paddingHorizontal: 15, paddingTop: 24, paddingBottom: 24 },
  gap: { marginTop: 16 },

  serviceCard: {
    height: 85,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  serviceTop: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceTitle: {
    flex: 1,
    marginRight: 8,
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },
  serviceRight: { flexDirection: 'row', alignItems: 'center' },
  servicePrice: {
    marginLeft: 6,
    fontFamily: FONT.semibold,
    fontSize: 16,
    lineHeight: 24,
    color: ORANGE,
    includeFontPadding: false,
  },
  serviceDate: {
    marginTop: 16,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#686868',
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
  infoIcon: { width: 12, height: 12, marginLeft: 3, tintColor: '#AA0303' },
});
