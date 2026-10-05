import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import LeaseCard from '../components/LeaseCard';
import { ICONS } from '../assets';
import { LEASES, SERVICES } from '../constants/paymentsData';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const BORDER = '#EAEAEA';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const STATUS_OPTIONS = ['Active', 'Expired'];

const ServiceCard = ({ item }) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceTop}>
      <Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>
      {!!item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
          <Image source={ICONS.info} style={styles.infoIcon} resizeMode="contain" />
        </View>
      )}
      <Text style={styles.servicePrice}>{item.amount}</Text>
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
        <TouchableOpacity
          style={[styles.tab, tab === 'Leases' && styles.tabActive]}
          onPress={() => { setTab('Leases'); setMenuOpen(false); }}
        >
          <Text style={[styles.tabText, tab === 'Leases' && styles.tabTextActive]}>
            Leases ({leases.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'Services' && styles.tabActive]}
          onPress={() => { setTab('Services'); setMenuOpen(false); }}
        >
          <Text style={[styles.tabText, tab === 'Services' && styles.tabTextActive]}>Services</Text>
        </TouchableOpacity>

        {tab === 'Leases' && (
          <View style={styles.statusWrap}>
            <Text style={styles.statusLabel}>Status:</Text>
            <TouchableOpacity style={styles.statusPill} activeOpacity={0.8} onPress={() => setMenuOpen((o) => !o)}>
              <Text style={styles.statusPillText}>{status}</Text>
              <View style={styles.chevronDown} />
            </TouchableOpacity>

            {menuOpen && (
              <View style={styles.menu}>
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.menuItem}
                    onPress={() => { setStatus(opt); setMenuOpen(false); }}
                  >
                    <Text style={[styles.menuText, opt === status && { color: ORANGE, fontFamily: FONT.medium }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setMenuOpen(false)}
      >
        {tab === 'Leases'
          ? leases.map((lease) => (
              <LeaseCard
                key={lease.id}
                lease={lease}
                onPress={() => navigation.navigate('PaymentDetailsScreen', { lease })}
              />
            ))
          : SERVICES.map((s) => <ServiceCard key={s.id} item={s} />)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginHorizontal: 16,
    zIndex: 20,
  },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  tabActive: { borderBottomColor: ORANGE },
  tabText: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
  tabTextActive: { fontFamily: FONT.medium, color: ORANGE },

  statusWrap: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', paddingBottom: 2 },
  statusLabel: { fontFamily: FONT.regular, fontSize: 8, color: TEXT, marginRight: 6 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 24,
  },
  statusPillText: { fontFamily: FONT.regular, fontSize: 8, color: TEXT, marginRight: 6 },
  chevronDown: {
    width: 5,
    height: 5,
    borderRightWidth: 1.2,
    borderBottomWidth: 1.2,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginBottom: 2,
  },
  menu: {
    position: 'absolute',
    top: 30,
    right: 0,
    width: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 4,
    elevation: 8,
    zIndex: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 12 },
  menuText: { fontFamily: FONT.regular, fontSize: 10, color: TEXT },

  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },

  serviceCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  serviceTop: { flexDirection: 'row', alignItems: 'center' },
  serviceTitle: { flex: 1, fontFamily: FONT.regular, fontSize: 10, color: TEXT },
  servicePrice: { fontFamily: FONT.semibold, fontSize: 10, color: ORANGE, marginLeft: 8 },
  serviceDate: { fontFamily: FONT.regular, fontSize: 8, color: '#8A8A8A', marginTop: 6 },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE3E3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: { fontFamily: FONT.medium, fontSize: 7, color: '#E04848' },
  infoIcon: { width: 7, height: 7, marginLeft: 3, tintColor: '#E04848' },
});
