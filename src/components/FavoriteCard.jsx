import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { ICONS } from '../assets';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const SLIDE_WIDTH = CARD_WIDTH - 2; // minus the 1px border on each side
const IMAGE_HEIGHT = Math.round(SLIDE_WIDTH * 0.62);

const ORANGE = '#FF6C40';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

/** One property card for the Favorites screen (swipeable photos, filled heart to remove). */
const FavoriteCard = ({ item, onToggleFavorite, onPress }) => {
  const images = item.images && item.images.length ? item.images : [item.image].filter(Boolean);
  const [active, setActive] = useState(0);

  const onMomentumEnd = (e) => {
    setActive(Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH));
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <FlatList
          data={images}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          bounces={false}
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumEnd}
          renderItem={({ item: img }) => (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onPress && onPress(item)}>
              <Image source={img} style={styles.image} />
            </TouchableOpacity>
          )}
        />

        <View style={styles.offersBadge} pointerEvents="none">
          <Text style={styles.offersText}>{item.offers != null ? item.offers : 3} Offers</Text>
        </View>

        <TouchableOpacity
          style={styles.heartBtn}
          activeOpacity={0.8}
          onPress={() => onToggleFavorite(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={ICONS.heartFilled} style={styles.heartFilled} resizeMode="contain" />
        </TouchableOpacity>

        {images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === active ? styles.dotActive : styles.dotInactive]} />
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.details} activeOpacity={0.85} onPress={() => onPress && onPress(item)}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

        <View style={styles.featuresRow}>
          <Feature icon={ICONS.bed} label={item.beds} />
          <View style={styles.divider} />
          <Feature icon={ICONS.bath} label={item.baths} />
          <View style={styles.divider} />
          <Feature icon={ICONS.area} label={item.sqft} />
        </View>

        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.timeRow}>
            <Image source={ICONS.clock} style={styles.clock} resizeMode="contain" />
            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteCard;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageWrapper: { width: SLIDE_WIDTH, height: IMAGE_HEIGHT },
  image: { width: SLIDE_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' },
  offersBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  offersText: { fontFamily: FONT.medium, fontSize: 10, color: '#1A1A1A' },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartFilled: { width: 24, height: 24 },
  dots: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: { width: 5, height: 5, borderRadius: 3, marginHorizontal: 2 },
  dotActive: { backgroundColor: ORANGE },
  dotInactive: { backgroundColor: '#FFFFFF' },

  details: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
  title: { fontFamily: FONT.semibold, fontSize: 14, color: '#000000', marginBottom: 6 },
  featuresRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 12, height: 12, tintColor: '#8A8A8A', marginRight: 4 },
  featureText: { fontFamily: FONT.regular, fontSize: 9, color: '#6B6B6B' },
  divider: { width: 1, height: 10, backgroundColor: '#D1D1D1', marginHorizontal: 8 },
  address: { fontFamily: FONT.regular, fontSize: 9, color: '#6B6B6B', marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontFamily: FONT.semibold, fontSize: 18, color: ORANGE },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  clock: { width: 11, height: 11, tintColor: ORANGE, marginRight: 4 },
  timeText: { fontFamily: FONT.regular, fontSize: 9, color: '#8A8A8A' },
});
