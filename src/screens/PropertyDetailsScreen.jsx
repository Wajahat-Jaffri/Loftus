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
import AroundThisHome from '../screens/AroundThisHome';
import OpenHouses from '../screens/OpenHouses';
import PaymentEstimate from '../screens/PaymentEstimate';

const ORANGE = '#FF6C40';
const GREY = '#9E9E9E';
const TEXT_DARK = '#1A1A1A';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = Math.round(SCREEN_W * 0.78);

const THUMB_GAP = 8;
const THUMB_W = Math.round((SCREEN_W - 20 - THUMB_GAP * 3) / 3.5);
const THUMB_H = Math.round(THUMB_W * 0.95);

const DESCRIPTION =
  "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident";

// 3-column facts grid (row by row, left to right).
const FACTS = [
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

const SCHOOLS = [
  { rating: '6/10', name: 'PS 212', info: 'Public, PreK-5 • Serves this home • 0.0mi' },
  { rating: '7/10', name: 'IS 145 Joseph Pulitzer', info: 'Public, 6-8 • Serves this home • 0.1mi' },
  { rating: '3/10', name: 'Newtown High School', info: 'Public, 9-12 • Serves this home • 1.0mi' },
];

// Matches the Figma frame; used when the screen is opened without a property.
const DEFAULT_PROPERTY = {
  id: 'details-1',
  title: 'Kings Landing - House',
  address: '1012 Ocean avenue, New York, USA',
  price: '$102,000',
  beds: 3,
  baths: 2,
  area: 2135,
  offerDeadline: 'February 20, 2025',
  offerSeconds: 50 * 3600 + 28 * 60 + 42, // 50:28:42
  images: [IMAGES.house3, IMAGES.house2, IMAGES.house1],
  description: DESCRIPTION,
  facts: FACTS,
  schools: SCHOOLS,
};

const toNumber = (value, fallback) => {
  const n = parseInt(String(value ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(n) ? fallback : n;
};

// Accepts a property from the listing (strings like '3 Bed', '2,135 sqft')
// and turns it into what this screen needs.
const normalizeProperty = (p) => {
  if (!p) return DEFAULT_PROPERTY;
  return {
    id: p.id ?? DEFAULT_PROPERTY.id,
    title: p.title ?? DEFAULT_PROPERTY.title,
    address: p.address ?? DEFAULT_PROPERTY.address,
    price: p.price ?? DEFAULT_PROPERTY.price,
    beds: toNumber(p.beds, DEFAULT_PROPERTY.beds),
    baths: toNumber(p.baths, DEFAULT_PROPERTY.baths),
    area: toNumber(p.sqft ?? p.area, DEFAULT_PROPERTY.area),
    offerDeadline: p.offerDeadline ?? DEFAULT_PROPERTY.offerDeadline,
    offerSeconds: p.offerSeconds ?? DEFAULT_PROPERTY.offerSeconds,
    images: p.images && p.images.length ? p.images : DEFAULT_PROPERTY.images,
    description: p.description ?? DEFAULT_PROPERTY.description,
    facts: p.facts ?? DEFAULT_PROPERTY.facts,
    schools: p.schools ?? DEFAULT_PROPERTY.schools,
  };
};

const pad2 = (n) => String(n).padStart(2, '0');

const formatCountdown = (total) => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
};

const PropertyDetailsScreen = ({ navigation, route }) => {
  const property = normalizeProperty(route?.params?.property);
  const { images } = property;

  const heroRef = useRef(null);
  const thumbsRef = useRef(null);
  const indexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(property.offerSeconds);
  // Turned off while a slider is being dragged so the page doesn't scroll.
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Live countdown in the orange banner.
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Keep the selected thumbnail in view.
  useEffect(() => {
    thumbsRef.current?.scrollTo({
      x: Math.max(activeIndex * (THUMB_W + THUMB_GAP) - 20, 0),
      animated: true,
    });
  }, [activeIndex]);

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
      `${property.address}\n\n${property.beds} bed  •  ${property.baths} bath  •  ${property.area} sqft\nPrice: ${property.price}\nOffer deadline: ${property.offerDeadline}`
    );
  };

  const stats = [
    { key: 'beds', label: 'Bedrooms', icon: ICONS.bed, value: property.beds },
    { key: 'baths', label: 'Bathrooms', icon: ICONS.bath, value: property.baths },
    { key: 'area', label: 'Area (sqft)', icon: ICONS.area, value: property.area },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Property Details</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleInfo}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Image source={ICONS.info} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.shareButton}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Image source={ICONS.share} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero slider */}
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
            renderItem={({ item }) => <Image source={item} style={styles.heroImage} />}
          />

          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.8}
            onPress={() => setIsFavorite((f) => !f)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={ICONS.heart}
              style={[styles.favoriteIcon, isFavorite && { tintColor: ORANGE }]}
            />
          </TouchableOpacity>

          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>

        {/* Offer banner with live countdown */}
        <View style={styles.offerBar}>
          <Text style={styles.offerText}>Offer deadline on {property.offerDeadline}</Text>
          <Text style={styles.offerTimer}>{formatCountdown(secondsLeft)} left</Text>
        </View>

        {/* Thumbnails */}
        <ScrollView
          ref={thumbsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbsContent}
        >
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.85}
                onPress={() => goTo(i)}
                style={[styles.thumb, isActive && styles.thumbActive]}
              >
                <Image source={img} style={styles.thumbImage} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Title / address / price */}
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text style={styles.title} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.address} numberOfLines={1}>
              {property.address}
            </Text>
          </View>
          <Text style={styles.price}>{property.price}</Text>
        </View>

        {/* Property details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.key} style={styles.statCard}>
                <View style={styles.statLabelRow}>
                  <Image source={s.icon} style={styles.statIcon} resizeMode="contain" />
                  <Text style={styles.statLabel} numberOfLines={1}>
                    {s.label}
                  </Text>
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Description */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        <View style={styles.divider} />

        {/* Facts grid */}
        <View style={styles.factsGrid}>
          {property.facts.map((fact, i) => (
            <View key={`${fact.label}-${i}`} style={styles.factItem}>
              <Text style={styles.factLabel} numberOfLines={1}>
                {fact.label}
              </Text>
              <Text style={styles.factValue} numberOfLines={1}>
                {fact.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Schools */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Schools</Text>
          <Text style={styles.schoolsSubtitle}>Great Schools Summary Rating</Text>

          {property.schools.map((school, i) => (
            <View key={`${school.name}-${i}`} style={styles.schoolRow}>
              <Text style={styles.schoolRating}>{school.rating}</Text>
              <View style={styles.schoolInfoCol}>
                <Text style={styles.schoolName}>{school.name}</Text>
                <Text style={styles.schoolInfo}>{school.info}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <AroundThisHome />

        <View style={styles.divider} />

        <OpenHouses />

        <View style={styles.divider} />

        <PaymentEstimate onSliderInteract={(active) => setScrollEnabled(!active)} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    marginTop: 46,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 48,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
  },
  backChevron: {
    fontSize: 30,
    lineHeight: 34,
    color: TEXT_DARK,
    fontWeight: '300',
  },
  headerTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: TEXT_DARK,
  },
  headerActions: {
    width: 40 + 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  shareButton: {
    marginLeft: 14,
  },
  headerIcon: {
    width: 22,
    height: 22,
    tintColor: TEXT_DARK,
  },

  content: {
    paddingBottom: 40,
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
    top: 12,
    right: 16,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    width: 26,
    height: 26,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: ORANGE,
  },
  dotInactive: {
    backgroundColor: '#FFFFFF',
  },

  // Offer banner
  offerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ORANGE,
    paddingHorizontal: 14,
    height: 30,
  },
  offerText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#FFFFFF',
  },
  offerTimer: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#FFFFFF',
  },

  // Thumbnails
  thumbsContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    marginRight: THUMB_GAP,
  },
  thumbActive: {
    borderColor: ORANGE,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Title row
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  titleCol: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontFamily: FONT.semibold,
    fontSize: 17,
    color: '#000000',
  },
  address: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#6B6B6B',
    marginTop: 2,
  },
  price: {
    fontFamily: FONT.semibold,
    fontSize: 20,
    color: ORANGE,
    marginTop: 2,
  },

  // Property details cards
  detailsSection: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  sectionTitle: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: TEXT_DARK,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31.5%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 10,
    paddingHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: 16,
    height: 16,
    tintColor: '#4A4A4A',
    marginRight: 5,
  },
  statLabel: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#4A4A4A',
  },
  statValue: {
    fontFamily: FONT.medium,
    fontSize: 20,
    color: ORANGE,
    marginTop: 4,
  },

  // Shared block + divider
  block: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginHorizontal: 20,
    marginTop: 18,
  },

  // Description
  description: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 17,
    color: '#6B6B6B',
  },

  // Facts grid
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  factItem: {
    width: '33.333%',
    paddingRight: 8,
    marginBottom: 14,
  },
  factLabel: {
    fontFamily: FONT.regular,
    fontSize: 9,
    color: '#8A8A8A',
    marginBottom: 2,
  },
  factValue: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: TEXT_DARK,
  },

  // Schools
  schoolsSubtitle: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#6B6B6B',
    marginTop: -4,
    marginBottom: 14,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  schoolRating: {
    width: 42,
    fontFamily: FONT.medium,
    fontSize: 12,
    color: TEXT_DARK,
  },
  schoolInfoCol: {
    flex: 1,
  },
  schoolName: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: TEXT_DARK,
  },
  schoolInfo: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#8A8A8A',
    marginTop: 1,
  },
});

export default PropertyDetailsScreen;
