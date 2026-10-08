import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT } from '../listing/ListingControls';

const FILE_TEXT = require('../../assets/icons/FileText.png');
const DOWNLOAD = require('../../assets/icons/DownloadSimple.png');
const CHAT_TEXT = require('../../assets/icons/ChatText.png');

export const LEASE_ICONS = { fileText: FILE_TEXT, download: DOWNLOAD, chatText: CHAT_TEXT };

const GREEN = '#03AA2F';
const RED = '#D33838';

/* ---------- toast (345 x 44, radius 14, padding 12) ---------- */
export const LeaseToast = ({ kind, children }) => {
  const ok = kind === 'success';
  return (
    <View style={[styles.toast, { backgroundColor: ok ? '#DFF0D8' : '#F2DEDE' }]}>
      <Text style={[styles.toastText, { color: ok ? '#455A3D' : '#C94D4D' }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
};

/* ---------- section title 16/500 #404040, 24 high, 12 above the content ---------- */
export const SectionTitle = ({ children }) => <Text style={styles.sectionTitle}>{children}</Text>;

/* ---------- orange pill button 345 x 50 ---------- */
export const PrimaryPill = ({ label, icon, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.85} style={[styles.pill, style]} onPress={onPress}>
    {icon ? <Image source={icon} style={styles.pillIcon} resizeMode="contain" /> : null}
    <Text style={styles.pillText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- property hero (Figma card 345 x 300) ---------- */
const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);
const Divider = () => <View style={styles.dividerLine} />;

export const PropertyHero = ({ lease }) => (
  <View style={styles.hero}>
    <View style={styles.heroPicture}>
      <Image source={lease.heroImage} style={styles.heroImage} resizeMode="cover" />
    </View>
    <View style={styles.heroInfo}>
      <Text style={styles.heroTitle} numberOfLines={1}>
        {lease.detailTitle}
      </Text>
      <View style={styles.featuresRow}>
        <Feature icon={ICONS.bed} label={lease.beds} />
        <Divider />
        <Feature icon={ICONS.bath} label={lease.baths} />
        <Divider />
        <Feature icon={ICONS.area} label={lease.sqft} />
      </View>
      <Text style={styles.heroAddress} numberOfLines={1}>
        {lease.detailAddress}
      </Text>
    </View>
  </View>
);

/* ---------- lease terms: three columns, space-between inside 8px padding ---------- */
const Tile = ({ label, value, labelWidth }) => (
  <View style={styles.tile}>
    <Text style={[styles.tileLabel, labelWidth && { width: labelWidth }]}>{label}</Text>
    <Text style={styles.tileValue}>{value}</Text>
  </View>
);

export const LeaseTerms = ({ terms }) => (
  <View style={styles.terms}>
    <View style={{ width: 85.89 }}>
      <Tile label="Lease Template" value={terms.template} />
      <View style={styles.tileGap} />
      <Tile label="Continue Month-to Month" value={terms.monthToMonth} labelWidth={63} />
      <View style={styles.tileGap} />
      <Tile label="Rent Grace Period" value={terms.gracePeriod} labelWidth={70.74} />
    </View>
    <View style={{ width: 111.16 }}>
      <Tile label="Lease Start Date" value={terms.startDate} />
      <View style={styles.tileGap} />
      <Tile label="Rent Amount" value={terms.rentAmount} />
      <View style={styles.tileGap} />
      <Tile label="Late Fee" value={terms.lateFee} />
      <View style={styles.tileGap} />
      <Tile label="Flooring" value={terms.flooring} />
    </View>
    <View style={{ width: 99.03 }}>
      <Tile label="Lease End Date" value={terms.endDate} />
      <View style={styles.tileGap} />
      <Tile label="Security Deposit" value={terms.securityDeposit} />
      <View style={styles.tileGap} />
      <Tile label="Non-Sufficient Funds Fee" value={terms.nsfFee} labelWidth={71.75} />
    </View>
  </View>
);

/* ---------- tenant row (345 x 92) ---------- */
export const StatusBadge = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export const TenantRow = ({ person, badge, onChat }) => (
  <View style={styles.tenantCard}>
    <View style={styles.tenantLeft}>
      <Image source={person.avatar} style={styles.tenantAvatar} />
      <View style={styles.tenantInfo}>
        <Text style={styles.tenantName} numberOfLines={1}>
          {person.name}
        </Text>
        {badge ? <StatusBadge label={badge.label} color={badge.color} /> : null}
      </View>
    </View>
    {onChat ? (
      <TouchableOpacity style={styles.chatBtn} activeOpacity={0.85} onPress={onChat}>
        <Image source={CHAT_TEXT} style={styles.chatIcon} resizeMode="contain" />
      </TouchableOpacity>
    ) : null}
  </View>
);

/* ---------- cost row (345 x 58) ---------- */
export const CostRow = ({ name, amount }) => (
  <View style={styles.costCard}>
    <Text style={styles.costName}>{name}</Text>
    <Text style={styles.costAmount}>{amount}</Text>
  </View>
);

export const badgeFor = (status) => {
  if (status === 'active') return { label: 'Accepted', color: GREEN };
  if (status === 'declined') return { label: 'Expired', color: RED }; // as in the Figma frame
  if (status === 'expired') return { label: 'Expired', color: RED };
  return { label: 'Pending', color: COLORS.orange };
};

const styles = StyleSheet.create({
  toast: {
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  toastText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 20,
    includeFontPadding: false,
  },

  sectionTitle: {
    height: 24,
    marginBottom: 12,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#404040',
    includeFontPadding: false,
  },

  pill: {
    height: 50,
    borderRadius: 50,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillIcon: { width: 20, height: 20, tintColor: '#FFFFFF', marginRight: 8 },
  pillText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  /* Figma card: border 0 1 1 1 rgba(133,135,138,.3), radius 12; the picture has its own full border */
  hero: {
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(133, 135, 138, 0.3)',
  },
  heroPicture: {
    height: 215,
    marginHorizontal: -1, // cover the card's side borders, like the Figma picture frame
    borderWidth: 1,
    borderColor: 'rgba(133, 135, 138, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EDEDED',
  },
  heroImage: { width: '100%', height: '100%' },
  heroInfo: { marginTop: 8, marginHorizontal: 8 },
  heroTitle: {
    height: 15,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 15,
    color: '#000000',
    includeFontPadding: false,
  },
  featuresRow: { marginTop: 10, height: 16, flexDirection: 'row', alignItems: 'center' },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 16, height: 16, tintColor: COLORS.orange, marginRight: 2 },
  featureText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  /* Figma: rotated 9px line has ~0 layout width => 5 + 5 = 10px between items */
  dividerLine: {
    width: 1,
    height: 9,
    marginHorizontal: 4.5,
    backgroundColor: '#4E4E4E',
    opacity: 0.5,
  },
  heroAddress: {
    marginTop: 10,
    height: 18,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    includeFontPadding: false,
  },

  terms: {
    height: 201,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tile: {},
  tileGap: { height: 15 },
  tileLabel: {
    fontFamily: FONT.medium,
    fontSize: 10,
    lineHeight: 15,
    color: '#7A7A7A',
    marginBottom: 2,
    includeFontPadding: false,
  },
  tileValue: {
    height: 18,
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },

  tenantCard: {
    height: 92,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tenantLeft: { flexDirection: 'row', height: 60 },
  tenantAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 6 },
  tenantInfo: { marginTop: 3, width: 167 },
  tenantName: {
    height: 18,
    marginBottom: 8,
    fontFamily: FONT.medium,
    fontSize: 18,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },
  badge: {
    alignSelf: 'flex-start',
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FONT.medium,
    fontSize: 10,
    lineHeight: 10,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  chatBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: { width: 16, height: 16, tintColor: '#FFFFFF' },

  costCard: {
    height: 58,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  costName: {
    height: 15,
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 15,
    color: '#000000',
    includeFontPadding: false,
  },
  costAmount: {
    height: 15,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 15,
    color: '#000000',
    includeFontPadding: false,
  },
});
