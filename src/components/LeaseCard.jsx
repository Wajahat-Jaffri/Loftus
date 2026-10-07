import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS, IMAGES } from '../assets';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};
const ORANGE = '#FF6C40';

// Figma lease card: 345 x 134, border 1 #E7E7E7, radius 15, padding 16, gap 16
const LeaseCard = ({ lease, onPress }) => {
  const active = lease.status !== 'Expired';
  const tenants = lease.tenants && lease.tenants.length
    ? lease.tenants.slice(0, 2)
    : [IMAGES.tenant1, IMAGES.tenant2];
  const balance = String(lease.balance ?? '0');
  const balanceText = balance.startsWith('$') ? balance : `$${balance}`;

  const Wrap = onPress ? TouchableOpacity : View;
  const wrapProps = onPress ? { onPress, activeOpacity: 0.85 } : {};

  return (
    <Wrap style={styles.card} {...wrapProps}>
      {/* top: title + status badge, address */}
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{lease.title}</Text>
          <View style={[styles.badge, active ? styles.badgeActive : styles.badgeExpired]}>
            <Text style={[styles.badgeText, { color: active ? '#03AA2F' : '#AA0303' }]}>
              {active ? 'Active' : 'Expired'}
            </Text>
          </View>
        </View>
        <View style={styles.addressRow}>
          <Image source={ICONS.mapPin} style={styles.pin} resizeMode="contain" />
          <Text style={styles.address} numberOfLines={1}>{lease.address}</Text>
        </View>
      </View>

      {/* bottom: balance / due date / tenants */}
      <View style={styles.bottom}>
        <View>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>{balanceText}</Text>
        </View>
        <View>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.due}>{lease.dueDate}</Text>
        </View>
        <View style={styles.tenantsBox}>
          <Text style={styles.label}>Tenants</Text>
          {tenants.map((src, i) => (
            <Image
              key={i}
              source={src}
              style={[styles.tenant, { left: i === 0 ? 0.74 : 22.08 }]}
            />
          ))}
        </View>
      </View>
    </Wrap>
  );
};

export default LeaseCard;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  top: {},
  titleRow: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginRight: 8,
    fontFamily: FONT.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    includeFontPadding: false,
  },
  badge: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: '#DDFFE6' },
  badgeExpired: { backgroundColor: '#FFDDDD' },
  badgeText: {
    fontFamily: FONT.medium,
    fontSize: 10,
    lineHeight: 15,
    includeFontPadding: false,
  },
  addressRow: {
    marginTop: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pin: { width: 8, height: 10, tintColor: '#686868', marginRight: 3 },
  address: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#686868',
    includeFontPadding: false,
  },

  bottom: {
    marginTop: 13.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 15,
    color: '#A5A5A5',
    includeFontPadding: false,
  },
  balance: {
    marginTop: -1.5,
    fontFamily: FONT.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: ORANGE,
    includeFontPadding: false,
  },
  due: {
    marginTop: -1.5,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#686868',
    includeFontPadding: false,
  },
  tenantsBox: { width: 53, height: 49 },
  tenant: {
    position: 'absolute',
    top: 19,
    width: 30.34,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
