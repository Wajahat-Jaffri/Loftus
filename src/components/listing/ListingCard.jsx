import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT } from './ListingControls';

const { width } = Dimensions.get('window');
const CARD_W = width - 32;
const IMG_W = CARD_W - 2;
const IMG_H = 170;

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

const ListingCard = ({ item, onPress }) => {
  const [index, setIndex] = useState(0);
  const images = item.images || [];
  const typeColor = item.type === 'Rent' ? COLORS.blue : COLORS.orange;
  const expired = item.status === 'expired';

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => onPress?.(item)}>
      <View style={styles.imageWrap}>
        <FlatList
          data={images}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          getItemLayout={(_, i) => ({ length: IMG_W, offset: IMG_W * i, index: i })}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / IMG_W))
          }
          renderItem={({ item: img }) => <Image source={img} style={styles.image} />}
        />

        <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>

        {!!item.expiresIn && (
          <View
            style={[styles.expiryBadge, { backgroundColor: expired ? COLORS.red : COLORS.orange }]}
          >
            <Text style={styles.badgeText}>{item.expiresIn}</Text>
          </View>
        )}

        {images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: i === index ? COLORS.orange : '#FFFFFF' }]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.featuresRow}>
          <Feature icon={ICONS.bed} label={item.beds} />
          <View style={styles.divider} />
          <Feature icon={ICONS.bath} label={item.baths} />
          <View style={styles.divider} />
          <Feature icon={ICONS.area} label={item.sqft} />
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.timeRow}>
            <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDEDED',
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageWrap: { width: IMG_W, height: IMG_H },
  image: { width: IMG_W, height: IMG_H, resizeMode: 'cover' },
  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  expiryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { fontFamily: FONT.medium, fontSize: 9, color: '#FFFFFF' },
  dots: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2.5 },
  details: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
  title: { fontFamily: FONT.semi, fontSize: 14, color: '#000000', marginBottom: 6 },
  featuresRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 12, height: 12, tintColor: COLORS.orange, marginRight: 4 },
  featureText: { fontFamily: FONT.regular, fontSize: 10, color: '#6B6B6B' },
  divider: { width: 1, height: 11, backgroundColor: '#D1D1D1', marginHorizontal: 8 },
  address: { fontFamily: FONT.regular, fontSize: 10, color: '#6B6B6B', marginBottom: 8 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  clockIcon: { width: 12, height: 12, tintColor: COLORS.orange, marginRight: 4 },
  timeText: { fontFamily: FONT.regular, fontSize: 10, color: '#8A8A8A' },
  price: { fontFamily: FONT.semi, fontSize: 18, color: COLORS.orange },
});

export default ListingCard;