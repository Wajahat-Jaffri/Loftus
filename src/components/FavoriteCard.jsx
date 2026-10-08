import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ICONS } from '../assets';

const { width } = Dimensions.get('window');
const ORANGE = '#FF6C40';

// Figma card: 345 x 343 (15px screen margin), border 0 1 1 1.
const CARD_WIDTH = width - 30;
const SLIDE_WIDTH = CARD_WIDTH - 2;
const IMAGE_HEIGHT = 224;

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

const Divider = () => <View style={styles.divider} />;

/**
 * Favorites card (same layout as the Explore PropertyCard, single property).
 * Props: item, onToggleFavorite(item), onPress(item).
 * Heart is always filled orange here (it is a favorite); tapping removes it.
 */
const FavoriteCard = ({ item, onToggleFavorite, onPress }) => {
  // Only the first image is decoded (same as the Explore card) to keep the screen light.
  const image = item.images?.[0] ?? item.image;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.slide}>
        {/* Picture frame 345 x 224 */}
        <View style={styles.imageWrapper}>
          <TouchableOpacity activeOpacity={0.95} onPress={() => onPress?.(item)}>
            <Image source={image} style={styles.image} resizeMethod="resize" />
          </TouchableOpacity>

          <View style={styles.offersBadge}>
            <Text style={styles.offersBadgeText}>{item.offers ?? 3} Offers</Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.8}
            onPress={() => onToggleFavorite?.(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={require('../assets/icons/HeartOrange.png')}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>

          <View style={styles.paginationContainer} pointerEvents="none">
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[styles.paginationDot, index === 0 ? styles.activeDot : styles.inactiveDot]}
              />
            ))}
          </View>
        </View>

        {/* Info block 329 x 103 */}
        <TouchableOpacity style={styles.cardDetails} activeOpacity={0.85} onPress={() => onPress?.(item)}>
          <View style={styles.titleBox}>
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          <View style={styles.featuresRow}>
            <Feature icon={ICONS.bedroom || ICONS.bed} label={item.beds} />
            <Divider />
            <Feature icon={ICONS.bath} label={item.baths} />
            <Divider />
            <Feature icon={ICONS.bed} label={item.sqft} />
          </View>

          <View style={styles.addressBox}>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.address}
            </Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>

          <View style={styles.timeAgoContainer}>
            <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
            <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(133,135,138,0.3)',
    overflow: 'hidden',
  },
  list: {
    width: SLIDE_WIDTH,
    flexGrow: 0,
  },
  image: { width: SLIDE_WIDTH, height: IMAGE_HEIGHT, resizeMode: 'cover' },
  slide: {
    width: SLIDE_WIDTH,
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
  },
  imageWrapper: {
    height: IMAGE_HEIGHT,
    width: SLIDE_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  propertyImage: {
    width: SLIDE_WIDTH,
    height: IMAGE_HEIGHT,
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
  offersBadgeText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#000000',
    includeFontPadding: false,
  },
  favoriteButton: {
    position: 'absolute',
    top: 11,
    right: 17,
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
  paginationContainer: {
    position: 'absolute',
    top: IMAGE_HEIGHT - 11 - 9,
    left: 0,
    right: 0,
    height: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDot: {
    marginHorizontal: 2,
  },
  activeDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: ORANGE,
  },
  inactiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },

  // Info block: 329 x 103, 8px below the image
  cardDetails: {
    height: 103,
    marginTop: 8,
    marginHorizontal: 7,
  },
  titleBox: {
    marginTop: -4,
    marginBottom: 7,
  },
  propertyTitle: {
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
    backgroundColor: '#4E4E4E',
    opacity: 0.5,
    marginHorizontal: 5,
  },
  addressBox: {
    height: 18,
    marginTop: 10,
    justifyContent: 'center',
  },
  addressText: {
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
  priceText: {
    fontFamily: FONT.semibold,
    fontSize: 22,
    lineHeight: 30,
    color: ORANGE,
    includeFontPadding: false,
  },
  timeAgoContainer: {
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
  timeAgoText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    opacity: 0.5,
    includeFontPadding: false,
  },
});

export default FavoriteCard;
