import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS } from '../../assets';
import { FONT, COLORS } from '../listing/ListingControls';
import { AvatarStack } from '../offers/OfferCard';

/**
 * Lease card (Figma 345 x 193, radius 15, padding 16, gap 16) - same layout as the Offer card
 * but without the Sale / Accepted badges:
 *  top : 53px picture + title + address
 *  grid: left [Price, Expires]   right [Term, Tenants]
 */
const Field = ({ label, value, highlight }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={highlight ? styles.valueHi : styles.value}>{value}</Text>
  </View>
);

const LeaseCard = ({ item, onPress }) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => onPress?.(item)}>
    <View style={styles.topRow}>
      <Image source={item.thumb} style={styles.thumb} />
      <View style={styles.topInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.addressRow}>
          <Image source={ICONS.mapPin} style={styles.pin} resizeMode="contain" />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.grid}>
      <View style={styles.colLeft}>
        <Field label="Price" value={item.price} highlight />
        <View style={styles.secondLeft}>
          <Field label="Expires" value={item.expires} />
        </View>
      </View>
      <View style={styles.colRight}>
        <Field label="Term" value={item.term} />
        <View style={styles.tenants}>
          <Text style={styles.fieldLabel}>Tenants</Text>
          <AvatarStack images={item.tenants} size={30} />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  /* Figma padding 16 + 1px border => 15 + 1 so the inner width stays 313 */
  card: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', height: 53 },
  thumb: { width: 53, height: 53, borderRadius: 4, marginRight: 16 },
  topInfo: { width: 200, height: 53 },
  title: {
    height: 15,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 15,
    color: '#000000',
    includeFontPadding: false,
  },
  addressRow: { marginTop: 4, height: 11, flexDirection: 'row', alignItems: 'center' },
  pin: { width: 8, height: 10, tintColor: '#686868', marginRight: 3 },
  address: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 11,
    color: '#686868',
    includeFontPadding: false,
  },

  grid: { marginTop: 16, height: 92, flexDirection: 'row', justifyContent: 'space-between' },
  colLeft: { minWidth: 90 },
  secondLeft: { marginTop: 12 },
  colRight: { width: 159.5 },
  tenants: { marginTop: 11, marginLeft: 0.74 },

  field: { alignSelf: 'flex-start' },
  fieldLabel: {
    height: 15,
    marginBottom: 4,
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 15,
    color: '#A5A5A5',
    includeFontPadding: false,
  },
  valueHi: {
    height: 15,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 15,
    color: COLORS.orange,
    includeFontPadding: false,
  },
  value: {
    height: 13,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 13,
    color: '#686868',
    includeFontPadding: false,
  },
});

export default LeaseCard;
