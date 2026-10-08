import React from 'react';
import { View, Text, ScrollView, Alert, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import {
  LeaseToast,
  SectionTitle,
  PrimaryPill,
  PropertyHero,
  LeaseTerms,
  TenantRow,
  CostRow,
  LEASE_ICONS,
  badgeFor,
} from '../components/lease/LeaseParts';
import { findLease } from '../constants/leaseData';

/**
 * Lease details (Figma 375 x 1438). Distances measured from the header bottom (y 96):
 * toast 21 / hero 85 / download 24 below hero / terms 24 / tenants 24 / costs 24 / end +38.
 */
const LeaseDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const lease = findLease(route?.params?.leaseId) || findLease('landlord-active-1');
  const badge = badgeFor(lease.status);

  const toast =
    lease.status === 'active'
      ? { kind: 'success', text: `Lease accepted on ${lease.decidedOn}.` }
      : lease.status === 'declined'
      ? { kind: 'error', text: `Lease declined on ${lease.decidedOn}.` }
      : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title={`Leases#${lease.leaseNo}`} onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 38 + insets.bottom }]}
      >
        {toast ? (
          <>
            <LeaseToast kind={toast.kind}>{toast.text}</LeaseToast>
            <View style={{ height: 20 }} />
          </>
        ) : null}

        <PropertyHero lease={lease} />

        <PrimaryPill
          style={styles.mt24}
          label="Download Lease Document"
          icon={LEASE_ICONS.download}
          onPress={() => Alert.alert('Lease document', 'Download will be connected to your API.')}
        />

        <View style={styles.mt24}>
          <LeaseTerms terms={lease.terms} />
        </View>

        <View style={styles.mt24}>
          <SectionTitle>Tenants</SectionTitle>
          {lease.people.map((p, i) => (
            <View key={`${p.name}-${i}`} style={i > 0 && styles.mt8}>
              <TenantRow person={p} badge={badge} onChat={i === 0 ? () => {} : undefined} />
            </View>
          ))}
        </View>

        <View style={styles.mt24}>
          <SectionTitle>Recurring Costs</SectionTitle>
          {lease.recurring.map((c, i) => (
            <View key={`${c.name}-${i}`} style={i > 0 && styles.mt8}>
              <CostRow name={c.name} amount={c.amount} />
            </View>
          ))}
        </View>

        <View style={styles.mt24}>
          <SectionTitle>One-Time Costs</SectionTitle>
          {lease.oneTime.map((c, i) => (
            <View key={`${c.name}-${i}`} style={i > 0 && styles.mt8}>
              <CostRow name={c.name} amount={c.amount} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingTop: 21, paddingHorizontal: 15 },
  mt24: { marginTop: 24 },
  mt8: { marginTop: 8 },
});

export default LeaseDetailsScreen;
