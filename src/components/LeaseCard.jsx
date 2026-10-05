import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS, IMAGES } from '../assets';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const GREY = '#8A8A8A';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

export const StatusBadge = ({ status }) => {
  const active = status === 'Active';
  return (
    <View style={[styles.badge, { backgroundColor: active ? '#E3F8E8' : '#FDE3E3' }]}>
      <Text style={[styles.badgeText, { color: active ? '#2BA84A' : '#E04848' }]}>{status}</Text>
    </View>
  );
};

const Tenants = () => (
  <View style={styles.tenantsRow}>
    <Image source={IMAGES.tenant1} style={styles.avatar} />
    <Image source={IMAGES.tenant2} style={[styles.avatar, styles.avatarOverlap]} />
    <View style={[styles.avatar, styles.avatarOverlap, styles.avatarMore]}>
      <Text style={styles.avatarMoreText}>+1</Text>
    </View>
  </View>
);

/** Lease summary card. Pass `onPress` to make it tappable. */
const LeaseCard = ({ lease, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>{lease.title}</Text>
        <StatusBadge status={lease.status} />
      </View>

      <View style={styles.addressRow}>
        <Image source={ICONS.mapPin} style={styles.pin} resizeMode="contain" />
        <Text style={styles.address} numberOfLines={1}>{lease.address}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>${lease.balance}</Text>
        </View>
        <View style={[styles.infoBlock, { flex: 1 }]}>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.due}>{lease.dueDate}</Text>
        </View>
        <View style={styles.tenantsBlock}>
          <Text style={styles.label}>Tenants</Text>
          <Tenants />
        </View>
      </View>
    </Wrapper>
  );
};

export default LeaseCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1, fontFamily: FONT.semibold, fontSize: 12, color: '#000000', marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontFamily: FONT.medium, fontSize: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  pin: { width: 9, height: 9, marginRight: 3 },
  address: { flex: 1, fontFamily: FONT.regular, fontSize: 8, color: TEXT },
  infoRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 12 },
  infoBlock: { marginRight: 36 },
  label: { fontFamily: FONT.regular, fontSize: 7, color: '#B0B0B0', marginBottom: 2 },
  balance: { fontFamily: FONT.semibold, fontSize: 12, color: ORANGE },
  due: { fontFamily: FONT.medium, fontSize: 9, color: TEXT, paddingTop: 2 },
  tenantsBlock: { alignItems: 'flex-end' },
  tenantsRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#FFFFFF' },
  avatarOverlap: { marginLeft: -8 },
  avatarMore: { backgroundColor: '#E5E5E5', alignItems: 'center', justifyContent: 'center' },
  avatarMoreText: { fontFamily: FONT.medium, fontSize: 6, color: GREY },
});
