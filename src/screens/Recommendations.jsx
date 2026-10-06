import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ICONS } from '../assets';
import { PROPERTIES } from '../constants/dummyData';
import { useFavorites } from '../context/FavoritesContext';

const ORANGE = '#FF6C40';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 40;
const IMAGE_H = 200;
const IMAGE_ROTATE_MS = 3500;

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

/** One recommendation card: rotating photo, details, time and price. */
const RecoCard = ({ item, onPress }) => {
  const images = item.images?.length ? item.images : [];
  const [imageIndex, setImageIndex] = useState(0);
  // Favorites are shared by the whole app (see FavoritesContext).
  const { isFavorite: isFavoriteId, toggleFavorite } = useFavorites();
  const isFavorite = isFavoriteId(item.id);

  // Photo changes by itself (no swipe, so it never fights the card carousel).
  useEffect(() => {
    if (images.length < 2) return undefined;
    const id = setInterval(() => {
      setImageIndex((i) => (i + 1) % images.length);
    }, IMAGE_ROTATE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <View style={styles.page}>
      <TouchableOpacity activeOpacity={0.95} onPress={() => onPress?.(item)} style={styles.card}>
        <View style={styles.imageWrap}>
          {images.length > 0 && (
            <Image source={images[imageIndex]} style={styles.image} />
          )}

          <View style={styles.offersBadge}>
            <Text style={styles.offersText}>{item.offers ?? 3} Offers</Text>
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            activeOpacity={0.8}
            onPress={() => toggleFavorite(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={isFavorite && ICONS.heartFilled ? ICONS.heartFilled : ICONS.heart}
              style={[styles.heartIcon, isFavorite && { tintColor: ORANGE }]}
            />
          </TouchableOpacity>

          <View style={styles.imageDots} pointerEvents="none">
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.imageDot, i === imageIndex ? styles.imageDotActive : styles.imageDotInactive]}
              />
            ))}
          </View>
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
    </View>
  );
};

/**
 * "Recommendations" — one card per page, swipe sideways, dots underneath.
 * Props:
 *  - items: list of properties (defaults to the dummy list without `currentId`)
 *  - currentId: the property being viewed, so it isn't recommended to itself
 *  - onPressItem(property): open that property
 */
const Recommendations = ({ items, currentId, onPressItem }) => {
  const data = (items || PROPERTIES).filter((p) => p.id !== currentId);
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);

  if (data.length === 0) return null;

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (index !== pageRef.current && index >= 0 && index < data.length) {
      pageRef.current = index;
      setPage(index);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Recommendations</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        bounces={false}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_W}
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={(_, i) => ({ length: SCREEN_W, offset: SCREEN_W * i, index: i })}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        renderItem={({ item }) => <RecoCard item={item} onPress={onPressItem} />}
      />

      <View style={styles.pageDots} pointerEvents="none">
        {data.map((item, i) => (
          <View
            key={String(item.id)}
            style={[styles.pageDot, i === page ? styles.pageDotActive : styles.pageDotInactive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 26,
  },
  heading: {
    fontFamily: FONT.semibold,
    fontSize: 18,
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  // Each page is a full screen wide; the card sits inside with 20px margins.
  page: {
    width: SCREEN_W,
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_W,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  imageWrap: {
    width: CARD_W - 2,
    height: IMAGE_H,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offersBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  offersText: {
    fontFamily: FONT.medium,
    fontSize: 10,
    color: '#1A1A1A',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  imageDots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2.5,
  },
  imageDotActive: {
    backgroundColor: ORANGE,
  },
  imageDotInactive: {
    backgroundColor: '#FFFFFF',
  },

  details: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  title: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: '#000000',
    marginBottom: 6,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 13,
    height: 13,
    tintColor: ORANGE,
    marginRight: 4,
  },
  featureText: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#6B6B6B',
  },
  divider: {
    width: 1,
    height: 11,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 8,
  },
  address: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 12,
    height: 12,
    tintColor: ORANGE,
    marginRight: 4,
  },
  timeText: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#8A8A8A',
  },
  price: {
    fontFamily: FONT.semibold,
    fontSize: 20,
    color: ORANGE,
  },

  // Dots under the card carousel
  pageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  pageDotActive: {
    backgroundColor: ORANGE,
  },
  pageDotInactive: {
    backgroundColor: '#D6D6D6',
  },
});

export default Recommendations;
