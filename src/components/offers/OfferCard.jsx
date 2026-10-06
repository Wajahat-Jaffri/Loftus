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
          i > 0 && { marginLeft: -size / 3 },
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
            <AvatarStack images={item.tenants} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 40, height: 40, borderRadius: 4, marginRight: 10 },
  topInfo: { flex: 1 },
  title: { fontFamily: FONT.semi, fontSize: 11, color: '#000000' },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  pin: { width: 8, height: 8, tintColor: '#6B6B6B', marginRight: 3 },
  address: { flex: 1, fontFamily: FONT.regular, fontSize: 8, color: '#6B6B6B' },
  badgesRow: { flexDirection: 'row', marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 1.5, borderRadius: 8, marginRight: 6 },
  badgeText: { fontFamily: FONT.medium, fontSize: 7, color: '#FFFFFF' },

  grid: { flexDirection: 'row', marginTop: 10 },
  col: { flex: 1 },
  field: { marginBottom: 8, minHeight: 24 },
  fieldLabel: { fontFamily: FONT.regular, fontSize: 7.5, color: COLORS.grey, marginBottom: 2 },
  fieldValue: { fontFamily: FONT.medium, fontSize: 10, color: COLORS.text },
  fieldValueHighlight: { fontFamily: FONT.semi, fontSize: 12, color: COLORS.orange },

  stack: { flexDirection: 'row', alignItems: 'center' },
  stackAvatar: { borderWidth: 1.5, borderColor: '#FFFFFF' },
});

export default OfferCard;