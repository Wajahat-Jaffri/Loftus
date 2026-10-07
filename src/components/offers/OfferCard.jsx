import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT } from '../listing/ListingControls';

export const AvatarStack = ({ images = [], size = 18 }) => (
  <View style={styles.stack}>
    {images.map((img, i) => (
      <Image
        key={i}
        source={img}
        style={[
          styles.stackAvatar,
          { width: size, height: size, borderRadius: size / 2 },
          i > 0 && { marginLeft: -size / 4 },
        ]}
      />
    ))}
  </View>
);

const Badge = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

const Field = ({ label, value, highlight }) => (
  <View style={styles.field}>
    <Text style={[styles.fieldLabel, highlight && { color: COLORS.orange }]}>{label}</Text>
    <Text style={[styles.fieldValue, highlight && styles.fieldValueHighlight]}>{value}</Text>
  </View>
);

const OfferCard = ({ item, onPress }) => {
  const [f1, f2, f3] = item.cardFields;

  return (
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
          <View style={styles.badgesRow}>
            <Badge label={item.type} color={COLORS.orange} />
            {item.status === 'accepted' && <Badge label="Accepted" color="#17A74A" />}
            {item.status === 'declined' && <Badge label="Declined" color="#D93636" />}
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.col}>
          <Field label={f1.label} value={f1.value} highlight />
          <Field label={f3.label} value={f3.value} />
        </View>
        <View style={styles.col}>
          <Field label={f2.label} value={f2.value} />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Tenant(s)</Text>
            <AvatarStack images={item.tenants} size={30} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: 16,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 56, height: 56, borderRadius: 4, marginRight: 16 },
  topInfo: { flex: 1 },
  title: { fontFamily: FONT.semi, fontSize: 17, color: '#000000' },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  pin: { width: 11, height: 11, tintColor: '#6B6B6B', marginRight: 4 },
  address: { flex: 1, fontFamily: FONT.regular, fontSize: 11.5, color: '#6B6B6B' },
  badgesRow: { flexDirection: 'row', marginTop: 5 },
  badge: { paddingHorizontal: 12, height: 19, justifyContent: 'center', borderRadius: 10, marginRight: 7 },
  badgeText: { fontFamily: FONT.medium, fontSize: 10.5, color: '#FFFFFF' },

  grid: { flexDirection: 'row', marginTop: 22 },
  col: { flex: 1 },
  field: { marginBottom: 12, minHeight: 36 },
  fieldLabel: { fontFamily: FONT.regular, fontSize: 10.5, color: COLORS.grey, marginBottom: 2 },
  fieldValue: { fontFamily: FONT.regular, fontSize: 15, color: '#4A4A4A' },
  fieldValueHighlight: { fontFamily: FONT.semi, fontSize: 18, color: COLORS.orange },

  stack: { flexDirection: 'row', alignItems: 'center' },
  stackAvatar: { borderWidth: 1.5, borderColor: '#FFFFFF' },
});

export default OfferCard;
