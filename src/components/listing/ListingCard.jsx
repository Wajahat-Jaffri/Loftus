import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT } from './ListingControls';

const PIC_BORDER = 'rgba(133, 135, 138, 0.3)';

/* icon 16 + 2px + text 11/500 */
const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

const Divider = () => <View style={styles.dividerLine} />;

/**
 * Listing card (Figma 345 x 343, radius 12).
 * Picture 345 x 224 (top corners 12) + Sale/Rent + expiry badges + dots,
 * then a 329 x 103 text block with the price at the bottom right.
 */
const ListingCard = ({ item, onPress }) => {
  const [index, setIndex] = useState(0);
  const [pw, setPw] = useState(0);
  const images = item.images || [];
  const typeColor = item.type === 'Rent' ? COLORS.blue : COLORS.orange;
  const expired = item.status === 'expired';

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.card} onPress={() => onPress?.(item)}>
      <View style={styles.picture} onLayout={(e) => setPw(e.nativeEvent.layout.width - 2)}>
        {pw > 0 && (
          <FlatList
            data={images}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            getItemLayout={(_, i) => ({ length: pw, offset: pw * i, index: i })}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / pw))}
            renderItem={({ item: img }) => (
              <Image source={img} style={{ width: pw, height: 222 }} resizeMode="cover" />
            )}
          />
        )}

        {/* badges row: Figma left 17 / top 11, 311 wide, space-between */}
        <View style={styles.badgeRow} pointerEvents="none">
          <View style={[styles.badge, { backgroundColor: typeColor }]}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
          {!!item.expiresIn && (
            <View
              style={[styles.badge, { backgroundColor: expired ? COLORS.red : COLORS.orange }]}
            >
              <Text style={styles.badgeText}>{item.expiresIn}</Text>
            </View>
          )}
        </View>

        {images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === index ? styles.dotOn : styles.dotOff]} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.textCol}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.featuresRow}>
            <Feature icon={ICONS.bed} label={item.beds} />
            <Divider />
            <Feature icon={ICONS.bath} label={item.baths} />
            <Divider />
            <Feature icon={ICONS.area} label={item.sqft} />
          </View>

          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>

          <View style={styles.timeRow}>
            <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>

        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    height: 343,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  picture: {
    height: 224,
    borderWidth: 1,
    borderColor: PIC_BORDER,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EDEDED',
  },

  badgeRow: {
    position: 'absolute',
    top: 10, // 11 minus the 1px picture border
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    height: 23,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  badgeText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 11,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  dots: {
    position: 'absolute',
    bottom: 10, // 11 minus the 1px picture border
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { borderRadius: 5, marginHorizontal: 2 },
  dotOn: { width: 9, height: 9, backgroundColor: COLORS.orange },
  dotOff: { width: 7, height: 7, backgroundColor: '#FFFFFF' },

  /* 8px under the picture, 8px side inset, 103 high */
  info: { height: 103, marginTop: 8, marginHorizontal: 8, justifyContent: 'center' },
  textCol: { height: 93, width: 227 },
  title: {
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
  address: {
    marginTop: 10,
    height: 18,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  timeRow: { marginTop: 10, height: 14, flexDirection: 'row', alignItems: 'center' },
  clockIcon: { width: 14, height: 14, tintColor: COLORS.orange, marginRight: 2 },
  timeText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 14,
    color: '#4E4E4E',
    opacity: 0.5,
    includeFontPadding: false,
  },
  price: {
    position: 'absolute',
    right: 0,
    bottom: 3,
    fontFamily: FONT.semi,
    height: 19,
    fontSize: 20,
    lineHeight: 19,
    color: COLORS.orange,
    includeFontPadding: false,
  },
});

export default ListingCard;
