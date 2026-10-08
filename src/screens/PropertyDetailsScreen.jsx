import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { ICONS, IMAGES } from '../assets';
import ScreenHeader from '../components/ScreenHeader';
import AroundThisHome from './AroundThisHome';
import OpenHouses from './OpenHouses';
import PaymentEstimate from './PaymentEstimate';
import ListingHistory from './ListingHistory';
import LocationSection from './LocationSection';
import Recommendations from './Recommendations';
import BottomActionBar from './BottomActionBar';
import { useFavorites } from '../context/FavoritesContext';

const ORANGE = '#FF6C40';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = 305; // Figma image frame 375 x 305

const DESCRIPTION =
  "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident";

// Facts are listed row by row (left to right); the screen lays them out in
// 3 columns exactly like Figma (column 1 = items 0,3,6,9,12 and so on).
const SALE_FACTS = [
  { label: 'Condo Fee', value: '$242,424' },
  { label: 'HOA Fee', value: '$2,424' },
  { label: 'HOA Fee Frequency', value: 'Daily' },
  { label: 'Lot Size', value: '1,345 SF' },
  { label: 'Condo Fee Frequency', value: 'Daily' },
  { label: 'Year Built', value: '2023' },
  { label: 'Nearest Metro', value: '1 mi' },
  { label: 'Property Type', value: 'Townhouse' },
  { label: 'House Style', value: 'Ranch' },
  { label: 'Countertop Type', value: 'Marble' },
  { label: 'Laundry', value: 'In Unit' },
  { label: 'Flooring', value: 'Hardwood' },
  { label: 'Heating', value: 'No' },
  { label: 'Air Conditioning', value: 'Ductless' },
];

const RENT_FACTS = [
  { label: 'Deposite', value: '$2,424' },
  { label: 'Lease Term', value: '12' },
  { label: 'Available Date', value: '27, Jan 2025' },
  { label: 'Entire Home', value: 'No' },
  { label: 'Lot Size', value: '1,345 SF' },
  { label: 'Year Built', value: '2023' },
  { label: 'Nearest Metro', value: '1 mi' },
  { label: 'Property Type', value: 'Townhouse' },
  { label: 'House Style', value: 'Ranch' },
  { label: 'Countertop Type', value: 'Marble' },
  { label: 'Laundry', value: 'In Unit' },
  { label: 'Flooring', value: 'Hardwood' },
  { label: 'Heating', value: 'No' },
  { label: 'Air Conditioning', value: 'Ductless' },
];

const SCHOOLS = [
  { rating: '6/10', name: 'PS 212', info: 'Public, PreK-5 • Serves this home • 0.0mi' },
  { rating: '7/10', name: 'IS 145 Joseph Pulitzer', info: 'Public, 6-8 • Serves this home • 0.1mi' },
  { rating: '3/10', name: 'Newtown High School', info: 'Public, 9-12 • Serves this home • 1.0mi' },
];

const DEFAULT_IMAGES = [IMAGES.house3, IMAGES.house2, IMAGES.house1];

const toNumber = (value, fallback) => {
  const n = parseInt(String(value ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(n) ? fallback : n;
};

const isRentProperty = (p, mode) =>
  mode === 'rent' || p?.mode === 'rent' || p?.listingType === 'rent' || p?.type === 'rent';

// Accepts a property from the listing (strings like '3 Bed', '2,135 sqft')
// and turns it into what this screen needs. Pass `mode: 'rent'` in the
// route params (or on the property) to get the Rent layout.
const normalizeProperty = (p, mode) => {
  const rent = isRentProperty(p, mode);
  return {
    rent,
    id: p?.id ?? (rent ? 'details-rent' : 'details-sale'),
    title: p?.title ?? 'Kings Landing - House',
    address: p?.address ?? '1012 Ocean avanue, New York, USA',
    price: p?.price ?? (rent ? '$424' : '$102,000'),
    beds: toNumber(p?.beds, 3),
    baths: toNumber(p?.baths, 2),
    area: toNumber(p?.sqft ?? p?.area, 2135),
    offerDeadline: p?.offerDeadline ?? 'February 20, 2025',
    offerSeconds: p?.offerSeconds ?? 50 * 3600 + 28 * 60 + 42, // 50:28:42
    images: p?.images && p.images.length ? p.images : DEFAULT_IMAGES,
    description: p?.description ?? DESCRIPTION,
    facts: p?.facts ?? (rent ? RENT_FACTS : SALE_FACTS),
    schools: p?.schools ?? SCHOOLS,
  };
};

const pad2 = (n) => String(n).padStart(2, '0');

const formatCountdown = (total) => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
};

// Row-by-row list -> 3 columns (Figma layout).
const toColumns = (facts) => {
  const cols = [[], [], []];
  facts.forEach((f, i) => cols[i % 3].push(f));
  return cols;
};

const Divider = () => <View style={styles.divider} />;

const PropertyDetailsScreen = ({ navigation, route }) => {
  const property = normalizeProperty(route?.params?.property, route?.params?.mode);
  const { images, rent } = property;

  const heroRef = useRef(null);
  const thumbsRef = useRef(null);
  const indexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const { isFavorite: isFavoriteId, toggleFavorite } = useFavorites();
  const isFavorite = isFavoriteId(property.id);
  const [secondsLeft, setSecondsLeft] = useState(property.offerSeconds);
  // Turned off while a slider is being dragged so the page doesn't scroll.
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const thumbGap = rent ? 16 : 8;

  // Live countdown in the orange banner (Sale only).
  useEffect(() => {
    if (rent) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [rent]);

  // Keep the selected thumbnail in view.
  useEffect(() => {
    thumbsRef.current?.scrollTo({
      x: Math.max(activeIndex * (104 + thumbGap) - 15, 0),
      animated: true,
    });
  }, [activeIndex, thumbGap]);

  const goTo = (index) => {
    indexRef.current = index;
    setActiveIndex(index);
    heroRef.current?.scrollToOffset({ offset: index * SCREEN_W, animated: true });
  };

  const handleHeroScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_W);
    if (index !== indexRef.current && index >= 0 && index < images.length) {
      indexRef.current = index;
      setActiveIndex(index);
    }
  };

  const openGallery = () => {
    navigation?.navigate('GalleryViewScreen', {
      property: route?.params?.property ?? property,
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: property.title,
        message: `${property.title} - ${property.price}\n${property.address}`,
      });
    } catch (e) {
      Alert.alert('Unable to share', 'Something went wrong. Please try again.');
    }
  };

  const handleInfo = () => {
    Alert.alert(
      property.title,
      `${property.address}\n\n${property.beds} bed  •  ${property.baths} bath  •  ${property.area} sqft\nPrice: ${property.price}`
    );
  };

  const stats = [
    { key: 'beds', label: 'Bedrooms', icon: ICONS.bedroom || ICONS.bed, size: 16, value: property.beds },
    { key: 'baths', label: 'Bathrooms', icon: ICONS.bath, size: 18, value: property.baths },
    { key: 'area', label: 'Area (sqft)', icon: ICONS.area, size: 17, value: property.area },
  ];

  const columns = toColumns(property.facts);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader
        title="Property Details"
        onBack={() => navigation?.goBack()}
        right={
          <>
            <TouchableOpacity
              onPress={handleInfo}
              style={styles.infoButton}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              <Image source={ICONS.info} style={styles.headerIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              <Image source={ICONS.share} style={styles.headerIcon} resizeMode="contain" />
            </TouchableOpacity>
          </>
        }
      />

      <ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero slider (375 x 305) */}
        <View style={styles.hero}>
          <FlatList
            ref={heroRef}
            data={images}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={SCREEN_W}
            decelerationRate="fast"
            disableIntervalMomentum
            nestedScrollEnabled
            getItemLayout={(_, i) => ({ length: SCREEN_W, offset: SCREEN_W * i, index: i })}
            scrollEventThrottle={16}
            onScroll={handleHeroScroll}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.95} onPress={openGallery}>
                <Image source={item} style={styles.heroImage} />
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.8}
            onPress={() => toggleFavorite(route?.params?.property ?? property)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={isFavorite ? require('../assets/icons/HeartOrange.png') : ICONS.heart}
              style={[styles.favoriteIcon, !isFavorite && { tintColor: '#FFFFFF' }]}
            />
          </TouchableOpacity>

          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View
                key={i}
                style={i === activeIndex ? styles.dotActive : styles.dotInactive}
              />
            ))}
          </View>
        </View>

        {/* Offer banner with live countdown (Sale only) */}
        {!rent && (
          <View style={styles.offerBar}>
            <Text style={styles.offerText}>Offer deadline on {property.offerDeadline}</Text>
            <Text style={styles.offerTimer}>{formatCountdown(secondsLeft)} left</Text>
          </View>
        )}

        {/* Thumbnails 104 x 100 */}
        <ScrollView
          ref={thumbsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.thumbsScroll, { marginTop: rent ? 38 : 14 }]}
          contentContainerStyle={styles.thumbsContent}
        >
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.85}
                onPress={() => goTo(i)}
                style={[
                  styles.thumb,
                  { marginRight: i < images.length - 1 ? thumbGap : 0 },
                  isActive && styles.thumbActive,
                ]}
              >
                <Image source={img} style={styles.thumbImage} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Title / address / price */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {property.title}
          </Text>
          <Text style={styles.address} numberOfLines={1}>
            {property.address}
          </Text>
          <Text style={styles.price}>{property.price}</Text>
        </View>

        <Text style={styles.detailsLabel}>Property Details</Text>

        {/* Main column: 345 wide, gap 16 */}
        <View style={styles.column}>
          {/* Stat cards 107 x 65 */}
          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <View
                key={s.key}
                style={[styles.statCard, i < stats.length - 1 && { marginRight: 12 }]}
              >
                <View style={styles.statLabelRow}>
                  <Image
                    source={s.icon}
                    style={{ width: s.size, height: s.size, tintColor: '#4E4E4E', marginRight: 8 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.statLabel} numberOfLines={1}>
                    {s.label}
                  </Text>
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          <Divider />

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <Divider />

          {/* Facts grid: 3 columns, tile gap 15 */}
          <View style={[styles.card, styles.factsCard]}>
            {columns.map((col, c) => (
              <View key={c}>
                {col.map((fact, i) => (
                  <View
                    key={`${fact.label}-${i}`}
                    style={[styles.factItem, i < col.length - 1 && { marginBottom: 15 }]}
                  >
                    <Text style={styles.factLabel} numberOfLines={1}>
                      {fact.label}
                    </Text>
                    <Text style={styles.factValue} numberOfLines={1}>
                      {fact.value}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <Divider />

          {/* Schools */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: '#000000' }]}>Schools</Text>
            <Text style={styles.schoolsSubtitle}>Great Schools Summary Rating</Text>

            {property.schools.map((school, i) => (
              <View
                key={`${school.name}-${i}`}
                style={[styles.schoolRow, i < property.schools.length - 1 && { marginBottom: 12 }]}
              >
                <Text style={styles.schoolRating}>{school.rating}</Text>
                <View style={styles.schoolInfoCol}>
                  <Text style={styles.schoolName} numberOfLines={1}>
                    {school.name}
                  </Text>
                  <Text style={styles.schoolInfo} numberOfLines={1}>
                    {school.info}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Divider />

          <View style={styles.gap16}>
            <AroundThisHome />
          </View>

          <Divider />

          {/* full-width wrapper: the slider must not sit outside its parent's bounds (Android touch) */}
          <View style={[styles.gap16, { marginHorizontal: -15 }]}>
            <OpenHouses />
          </View>

          {!rent && (
            <>
              <Divider />
              <View style={styles.gap16}>
                <PaymentEstimate onSliderInteract={(active) => setScrollEnabled(!active)} />
              </View>
            </>
          )}
        </View>

        <View style={styles.sectionBlock22}>
          <ListingHistory />
        </View>

        <View style={styles.sectionBlock26}>
          <LocationSection onExpand={() => navigation?.navigate('MapViewScreen')} />
        </View>

        <Recommendations
          currentId={property.id}
          onPressItem={(p) => navigation?.push('PropertyDetailsScreen', { property: p })}
        />
      </ScrollView>

      <BottomActionBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },

  infoButton: {
    marginRight: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#444444',
  },

  content: {
    paddingBottom: 24,
  },

  // Hero
  hero: {
    width: SCREEN_W,
    height: HERO_H,
  },
  heroImage: {
    width: SCREEN_W,
    height: HERO_H,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 14,
    right: 15,
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
  dots: {
    position: 'absolute',
    bottom: 11,
    left: 0,
    right: 0,
    height: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginHorizontal: 2,
    backgroundColor: ORANGE,
  },
  dotInactive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginHorizontal: 2,
    backgroundColor: '#FFFFFF',
  },

  // Offer banner: 375 x 24, padding 3 / 16
  offerBar: {
    height: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ORANGE,
  },
  offerText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  offerTimer: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  // Thumbnails
  thumbsScroll: {
    flexGrow: 0,
  },
  thumbsContent: {
    paddingHorizontal: 15,
  },
  thumb: {
    width: 104,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbActive: {
    borderColor: ORANGE,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Title row: top 563 (24 below thumbnails), height 38
  titleRow: {
    height: 38,
    marginTop: 24,
    paddingHorizontal: 15,
  },
  title: {
    marginTop: -4,
    paddingRight: 130,
    fontFamily: FONT.semibold,
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },
  address: {
    marginTop: 9,
    paddingRight: 130,
    marginLeft: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  price: {
    position: 'absolute',
    right: 15,
    top: 13.5,
    fontFamily: FONT.semibold,
    fontSize: 22,
    lineHeight: 30,
    color: ORANGE,
    includeFontPadding: false,
  },

  detailsLabel: {
    marginTop: 25,
    paddingHorizontal: 15,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#303131',
    includeFontPadding: false,
  },

  // Main column
  column: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  divider: {
    height: 1,
    marginTop: 16,
    backgroundColor: '#DFDFDF',
  },

  // Stat cards
  statsRow: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statLabelRow: {
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  statValue: {
    fontFamily: FONT.regular,
    fontSize: 20,
    lineHeight: 26,
    color: ORANGE,
    includeFontPadding: false,
  },

  // Cards with padding 8
  card: {
    padding: 8,
    marginTop: 16,
    marginBottom: 0,
  },
  cardTitle: {
    marginBottom: 12,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#303131',
    includeFontPadding: false,
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#3D3D3D',
    includeFontPadding: false,
  },

  // Facts grid
  factsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  factItem: {},
  factLabel: {
    fontFamily: FONT.medium,
    fontSize: 10,
    lineHeight: 15,
    color: '#7A7A7A',
    includeFontPadding: false,
  },
  factValue: {
    marginTop: 2,
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },

  // Schools
  schoolsSubtitle: {
    marginTop: -8,
    marginBottom: 16,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#686868',
    includeFontPadding: false,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolRating: {
    width: 25,
    marginRight: 12,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },
  schoolInfoCol: {
    flex: 1,
  },
  schoolName: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },
  schoolInfo: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#686868',
    includeFontPadding: false,
  },

  gap16: {
    marginTop: 16,
  },

  // Sections after the main column
  sectionBlock22: {
    marginTop: 22,
    paddingHorizontal: 15,
  },
  sectionBlock26: {
    marginTop: 26,
    paddingHorizontal: 15,
  },
});

export default PropertyDetailsScreen;
