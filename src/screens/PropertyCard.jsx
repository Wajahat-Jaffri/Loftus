import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ICONS } from '../assets';
import { useFavorites } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');
// 20px screen padding on each side, minus 1px border on each side of the card.
const CARD_WIDTH = width - 40;
const SLIDE_WIDTH = CARD_WIDTH - 2;
const IMAGE_HEIGHT = 215;

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

/**
 * One card, one horizontal slider.
 * - Swipe left/right to change slide (paged).
 * - Auto-advances every AUTO_SLIDE_MS and loops back to the first slide.
 * - Auto-slide pauses while the user is dragging and restarts after.
 * - Heart adds/removes the property from the shared Favorites list.
 */
const PropertyCard = ({
  items = [],
  autoSlide = true,
  autoSlideMs = AUTO_SLIDE_MS,
  onToggleFavorite,
  onPressItem,
}) => {
  const listRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  // Bumped after a manual swipe so the auto-slide timer restarts from zero.
  const [timerKey, setTimerKey] = useState(0);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const goTo = useCallback((index, animated = true) => {
    indexRef.current = index;
    setActiveIndex(index);
    listRef.current?.scrollToOffset({
      offset: index * SLIDE_WIDTH,
      animated,
    });
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!autoSlide || items.length < 2) return undefined;
    const id = setInterval(() => {
      const next = (indexRef.current + 1) % items.length;
      goTo(next);
    }, autoSlideMs);
    return () => clearInterval(id);
  }, [autoSlide, autoSlideMs, items.length, timerKey, goTo]);

  // Keep dots in sync while swiping.
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    if (index !== indexRef.current && index >= 0 && index < items.length) {
      indexRef.current = index;
      setActiveIndex(index);
    }
  };

  // User finished a swipe -> restart the auto-slide countdown.
  const handleMomentumEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    indexRef.current = clampIndex(index, items.length);
    setActiveIndex(indexRef.current);
    setTimerKey((k) => k + 1);
  };

  const handleFavorite = (item) => {
    toggleFavorite(item);
    onToggleFavorite?.(item.id);
  };

  const renderSlide = ({ item }) => {
    const image = item.images?.[0];
    const favorite = isFavorite(item.id);

    return (
      <View style={styles.slide}>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image source={image} style={styles.propertyImage} />

          <View style={styles.offersBadge}>
            <Text style={styles.offersBadgeText}>{item.offers ?? 3} Offers</Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.8}
            onPress={() => handleFavorite(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {favorite ? (
              <Image source={ICONS.heartFilled} style={styles.favoriteFilled} resizeMode="contain" />
            ) : (
              <Image source={ICONS.heart} style={styles.favoriteIcon} />
            )}
          </TouchableOpacity>
        </View>

        {/* Details of this slide's property */}
        <TouchableOpacity
          style={styles.cardDetails}
          activeOpacity={0.85}
          onPress={() => onPressItem?.(item)}
        >
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.featuresRow}>
            <Feature icon={ICONS.bed} label={item.beds} />
            <View style={styles.divider} />
            <Feature icon={ICONS.bath} label={item.baths} />
            <View style={styles.divider} />
            <Feature icon={ICONS.bed} label={item.sqft} />
          </View>

          <Text style={styles.addressText} numberOfLines={1}>
            {item.address}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{item.price}</Text>
            <View style={styles.timeAgoContainer}>
              <Image
                source={ICONS.clock}
                style={styles.clockIcon}
                resizeMode="contain"
              />
              <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <FlatList
        ref={listRef}
        data={items}
        extraData={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSlide}
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

      {/* Pagination dots — one set for the whole slider, over the image area */}
      <View style={styles.paginationContainer} pointerEvents="none">
        {items.map((item, index) => (
          <View
            key={String(item.id)}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const clampIndex = (i, length) => Math.min(Math.max(i, 0), Math.max(length - 1, 0));

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginBottom: 18,
    overflow: 'hidden',
    
  },
  list: { width: SLIDE_WIDTH, flexGrow: 0 },
  slide: { width: SLIDE_WIDTH, backgroundColor: '#FFFFFF' },
  imageWrapper: { height: IMAGE_HEIGHT, width: SLIDE_WIDTH },
  propertyImage: { width: SLIDE_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' },
  offersBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  offersBadgeText: { fontFamily: FONT.medium, fontSize: 11, color: '#1A1A1A' },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: { width: 24, height: 24, tintColor: '#FFFFFF', resizeMode: 'contain' },
  favoriteFilled: { width: 24, height: 24 },
  paginationContainer: {
    position: 'absolute',
    // sits on the bottom edge of the image, fixed while slides move
    top: IMAGE_HEIGHT - 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2.5 },
  activeDot: { backgroundColor: '#FF6C40' },
  inactiveDot: { backgroundColor: '#FFFFFF' },
  cardDetails: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
  propertyTitle: { fontFamily: FONT.semibold, fontSize: 15, color: '#000000', marginBottom: 6 },
  featuresRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 13, height: 13, tintColor: '#8A8A8A', marginRight: 4 },
  featureText: { fontFamily: FONT.regular, fontSize: 10, color: '#6B6B6B' },
  divider: { width: 1, height: 11, backgroundColor: '#D1D1D1', marginHorizontal: 8 },
  addressText: { fontFamily: FONT.regular, fontSize: 10, color: '#6B6B6B', marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontFamily: FONT.semibold, fontSize: 20, color: '#FF6C40' },
  timeAgoContainer: { flexDirection: 'row', alignItems: 'center' },
  clockIcon: { width: 12, height: 12, tintColor: '#FF6C40', marginRight: 4 },
  timeAgoText: { fontFamily: FONT.regular, fontSize: 10, color: '#8A8A8A' },
});

export default PropertyCard;
