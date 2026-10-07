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
const CARD_W = SCREEN_W - 30; // Figma card: 345 wide, 15px side margin
const IMAGE_H = 224;
const IMAGE_ROTATE_MS = 3500;

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

/** One recommendation card (same layout as the Explore card, 345 x 343). */
const RecoCard = ({ item, onPress }) => {
  const images = item.images?.length ? item.images : [];
  const [imageIndex, setImageIndex] = useState(0);
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
          {images.length > 0 && <Image source={images[imageIndex]} style={styles.image} />}

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
                style={i === imageIndex ? styles.imageDotActive : styles.imageDotInactive}
              />
            ))}
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.titleBox}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          <View style={styles.featuresRow}>
            <Feature icon={ICONS.bedroom || ICONS.bed} label={item.beds} />
            <View style={styles.divider} />
            <Feature icon={ICONS.bath} label={item.baths} />
            <View style={styles.divider} />
            <Feature icon={ICONS.bed} label={item.sqft} />
          </View>

          <View style={styles.addressBox}>
            <Text style={styles.address} numberOfLines={1}>
              {item.address}
            </Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.price}>{item.price}</Text>
          </View>

          <View style={styles.timeRow}>
            <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

/**
 * "Recommendations": heading 20/500, one 345 x 343 card per page,
 * swipe sideways, dots underneath.
 *
 * Props:
 *  - items: list of properties (defaults to the dummy list)
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
    marginTop: 24,
  },
  heading: {
    height: 30,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontFamily: FONT.medium,
    fontSize: 20,
    lineHeight: 30,
    color: '#303131',
    includeFontPadding: false,
  },

  // Each page is a full screen wide; the card sits inside with 15px margins.
  page: {
    width: SCREEN_W,
    paddingHorizontal: 15,
  },
  card: {
    width: CARD_W,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(133,135,138,0.3)',
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
    top: 11,
    left: 17,
    height: 23,
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  offersText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#000000',
    includeFontPadding: false,
  },
  heartButton: {
    position: 'absolute',
    top: 11,
    right: 17,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  imageDots: {
    position: 'absolute',
    bottom: 11,
    left: 0,
    right: 0,
    height: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDotActive: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginHorizontal: 2,
    backgroundColor: ORANGE,
  },
  imageDotInactive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginHorizontal: 2,
    backgroundColor: '#FFFFFF',
  },

  details: {
    height: 103,
    marginTop: 8,
    marginHorizontal: 7,
  },
  titleBox: {
    marginTop: -4,
    marginBottom: 7,
  },
  title: {
    fontFamily: FONT.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    includeFontPadding: false,
  },
  featuresRow: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 16,
    height: 16,
    tintColor: ORANGE,
    marginRight: 2,
  },
  featureText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  divider: {
    width: 0.5,
    height: 9,
    marginHorizontal: 5,
    backgroundColor: '#4E4E4E',
    opacity: 0.5,
  },
  addressBox: {
    height: 18,
    marginTop: 10,
    justifyContent: 'center',
  },
  address: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  priceBox: {
    position: 'absolute',
    left: 0,
    top: 74.5,
  },
  price: {
    fontFamily: FONT.semibold,
    fontSize: 22,
    lineHeight: 30,
    color: ORANGE,
    includeFontPadding: false,
  },
  timeRow: {
    position: 'absolute',
    right: 0,
    bottom: -2,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 14,
    height: 14,
    tintColor: ORANGE,
    marginRight: 2,
  },
  timeText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    opacity: 0.5,
    includeFontPadding: false,
  },

  // Dots under the card carousel
  pageDots: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
