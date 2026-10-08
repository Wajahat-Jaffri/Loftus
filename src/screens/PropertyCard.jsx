import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ICONS } from '../assets';
import { useFavorites } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');
const ORANGE = '#FF6C40';

// Figma card: 345 wide (15px screen margin), border 0 1 1 1, picture 224 high.
const CARD_WIDTH = width - 30;
const SLIDE_WIDTH = CARD_WIDTH - 2; // picture frame has its own 1px border
const IMAGE_HEIGHT = 224;

// Auto-slide every N milliseconds (restarts after the user swipes).
const AUTO_SLIDE_MS = 3500;

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

/* Figma: the rotated 9px line has ~0 layout width => 5 + 5 = 10px between the items */
const Divider = () => <View style={styles.divider} />;

const WhiteBadge = ({ label }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

/**
 * One property card (Figma 345 x 343):
 *  - picture 224 with its own image slider, "N Offers" / "Open House" badges, heart,
 *    optional "Promotion" pill and the pagination dots
 *  - info block 329 x 103: title, beds / baths / sqft, address, time ago, price (bottom right)
 *
 * item fields: id, images[], title, beds, baths, sqft, address, price, timeAgo,
 *              offers (number), openHouse (bool), promotion (bool | label), priceRange (string)
 */
const PropertyCard = ({
  item,
  autoSlide = true,
  autoSlideMs = AUTO_SLIDE_MS,
  onToggleFavorite,
  onPressItem,
}) => {
  const images = item.images?.length ? item.images : item.image ? [item.image] : [];
  const listRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(item.id);

  const goTo = useCallback((index, animated = true) => {
    indexRef.current = index;
    setActiveIndex(index);
    listRef.current?.scrollToOffset({ offset: index * SLIDE_WIDTH, animated });
  }, []);

  useEffect(() => {
    if (!autoSlide || images.length < 2) return undefined;
    const id = setInterval(() => {
      goTo((indexRef.current + 1) % images.length);
    }, autoSlideMs);
    return () => clearInterval(id);
  }, [autoSlide, autoSlideMs, images.length, timerKey, goTo]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    if (index !== indexRef.current && index >= 0 && index < images.length) {
      indexRef.current = index;
      setActiveIndex(index);
    }
  };

  const handleMomentumEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    indexRef.current = Math.min(Math.max(index, 0), Math.max(images.length - 1, 0));
    setActiveIndex(indexRef.current);
    setTimerKey((k) => k + 1);
  };

  const handleHeartPress = () => {
    toggleFavorite(item);
    onToggleFavorite?.(item);
  };

  const promotionLabel = typeof item.promotion === 'string' ? item.promotion : 'Promotion';

  return (
    <View style={styles.cardContainer}>
      {/* Picture frame 345 x 224 */}
      <View style={styles.imageWrapper}>
        <FlatList
          ref={listRef}
          data={images}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item: img }) => (
            <TouchableOpacity activeOpacity={0.95} onPress={() => onPressItem?.(item)}>
              <Image source={img} style={styles.propertyImage} />
            </TouchableOpacity>
          )}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={SLIDE_WIDTH}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          nestedScrollEnabled
          getItemLayout={(_, index) => ({
            length: SLIDE_WIDTH,
            offset: SLIDE_WIDTH * index,
            index,
          })}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          style={styles.list}
        />

        {/* badges: Figma left 17 / top 11, gap 8 */}
        <View style={styles.badgesRow} pointerEvents="none">
          <WhiteBadge label={`${item.offers ?? 3} Offers`} />
          {item.openHouse ? <WhiteBadge label="Open House" /> : null}
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.8}
          onPress={handleHeartPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={liked ? require('../assets/icons/HeartOrange.png') : ICONS.heart}
            style={[styles.favoriteIcon, !liked && { tintColor: '#FFFFFF' }]}
          />
        </TouchableOpacity>

        {item.promotion ? (
          <View style={styles.promotion} pointerEvents="none">
            <Text style={styles.promotionText}>{promotionLabel}</Text>
          </View>
        ) : null}

        {/* dots: 9px active + 7px inactive, gap 4, Figma top 204 */}
        {images.length > 1 ? (
          <View style={styles.paginationContainer} pointerEvents="none">
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        ) : null}
      </View>

      {/* Info block 329 x 103 */}
      <TouchableOpacity
        style={styles.cardDetails}
        activeOpacity={0.85}
        onPress={() => onPressItem?.(item)}
      >
        <View style={styles.textCol}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.featuresRow}>
            <Feature icon={ICONS.bedroom || ICONS.bed} label={item.beds} />
            <Divider />
            <Feature icon={ICONS.bath} label={item.baths} />
            <Divider />
            <Feature icon={ICONS.area || ICONS.bed} label={item.sqft} />
          </View>

          <Text style={styles.addressText} numberOfLines={1}>
            {item.address}
          </Text>

          <View style={styles.timeAgoContainer}>
            <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
            <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
          </View>
        </View>

        <Text style={styles.priceText}>{item.priceRange || item.price}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(133,135,138,0.3)',
    marginBottom: 16,
    paddingBottom: 8,
    overflow: 'hidden',
  },

  /* picture frame: 1px border on all sides, top corners 12 (covers the card's side borders) */
  imageWrapper: {
    height: IMAGE_HEIGHT,
    marginHorizontal: -1,
    borderWidth: 1,
    borderColor: 'rgba(133,135,138,0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EDEDED',
  },
  list: { width: SLIDE_WIDTH, flexGrow: 0 },
  propertyImage: {
    width: SLIDE_WIDTH,
    height: IMAGE_HEIGHT - 2,
    resizeMode: 'cover',
  },

  badgesRow: {
    position: 'absolute',
    top: 10, // Figma 11 minus the 1px border
    left: 16, // Figma 17 minus the 1px border
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    height: 23,
    paddingHorizontal: 8,
    marginRight: 8,
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
  badgeText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 11,
    color: '#000000',
    includeFontPadding: false,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },

  /* Figma "Promotion": 79 x 24 at left 17 / top 185 */
  promotion: {
    position: 'absolute',
    left: 16,
    top: 184,
    height: 24,
    minWidth: 79,
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  promotionText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 12,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  paginationContainer: {
    position: 'absolute',
    top: 203, // Figma 204 minus the 1px border
    left: 0,
    right: 0,
    height: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDot: { marginHorizontal: 2 },
  activeDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: ORANGE },
  inactiveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#FFFFFF' },

  /* Info block: 329 x 103, 8px below the picture */
  cardDetails: {
    height: 103,
    marginTop: 8,
    marginHorizontal: 7,
    justifyContent: 'center',
  },
  textCol: { height: 93, width: 227 },
  propertyTitle: {
    height: 15,
    fontFamily: FONT.semibold,
    fontSize: 16,
    lineHeight: 15,
    color: '#000000',
    includeFontPadding: false,
  },
  featuresRow: {
    marginTop: 10,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 16, height: 16, tintColor: ORANGE, marginRight: 2 },
  featureText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  divider: {
    width: 1,
    height: 9,
    marginHorizontal: 4.5,
    backgroundColor: '#4E4E4E',
    opacity: 0.5,
  },
  addressText: {
    marginTop: 10,
    height: 18,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  timeAgoContainer: {
    marginTop: 10,
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: { width: 14, height: 14, tintColor: ORANGE, marginRight: 2 },
  timeAgoText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 14,
    color: '#4E4E4E',
    opacity: 0.5,
    includeFontPadding: false,
  },
  priceText: {
    position: 'absolute',
    right: 0,
    bottom: 3,
    height: 19,
    fontFamily: FONT.semibold,
    fontSize: 20,
    lineHeight: 19,
    color: ORANGE,
    textAlign: 'right',
    includeFontPadding: false,
  },
});

export default PropertyCard;
