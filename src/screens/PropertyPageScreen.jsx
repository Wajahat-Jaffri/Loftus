import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICONS, IMAGES } from '../assets';
import AroundThisHome from './AroundThisHome';
import OpenHouses from './OpenHouses';
import PaymentEstimate from './PaymentEstimate';
import ListingHistory from './ListingHistory';
import LocationSection from './LocationSection';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const { width: W } = Dimensions.get('window');
const HERO_H = Math.round(W * 0.58);
const THUMB_GAP = 8;
const THUMB_W = Math.round((W - 16 - THUMB_GAP * 3) / 3.2);
const THUMB_H = Math.round(THUMB_W * 0.72);

const DEFAULT_FACTS = [
  { label: 'Deposit', value: '$2,424' },
  { label: 'Lease Term', value: '12' },
  { label: 'Available Date', value: '27, Jan 2025' },
  { label: 'Online Home', value: 'No' },
  { label: 'Year Built', value: '2023' },
  { label: 'Lot Size', value: '1,345 SF' },
  { label: 'Property Type', value: 'Townhouse' },
  { label: 'House Style', value: 'Ranch' },
  { label: 'Nearest Metro', value: '1 mi' },
  { label: 'Laundry', value: 'In Unit' },
  { label: 'Flooring', value: 'Hardwood' },
  { label: 'Countertop Type', value: 'Marble' },
  { label: 'Air Conditioning', value: 'Ductless' },
  { label: 'Heating', value: 'No' },
];
const DEFAULT_FEATURES = [
  'Attic', 'Basement', 'Pool', 'Loft', 'Sunroom', 'Backyard', 'Deck', 'Patio', 'Front yard',
  'Dishwasher', 'Disposal', 'Microwave', 'Ice Dispenser', 'Oven', 'Furnished', 'Den', 'Balcony',
  'Pet friendly',
];
const DEFAULT_AMENITIES = [
  'Fitness Center', 'Business Center', 'ClubHouse', 'Game Room', 'Dog Park', 'Concierge',
  'Package service', 'Elevator',
];
const DEFAULT_DESCRIPTION =
  "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident";

const SCHOOLS = [
  { rating: '6/10', name: 'PS 212', info: 'Public, PreK-5 • Serves this home • 0.0mi' },
  { rating: '7/10', name: 'IS 145 Joseph Pulitzer', info: 'Public, 6-8 • Serves this home • 0.1mi' },
  { rating: '3/10', name: 'Newtown High School', info: 'Public, 9-12 • Serves this home • 1.0mi' },
];

const MENU = [
  { label: 'Lease', icon: ICONS.lease },
  { label: 'Sale Listing', icon: ICONS.moneyWavy },
  { label: 'Rental Listing', icon: ICONS.buildingOffice },
  { label: 'Service Staff', icon: ICONS.serviceStaff },
];

const TrashIcon = () => (
  <View style={styles.trash}>
    <View style={styles.trashLid} />
    <View style={styles.trashBody} />
  </View>
);

const Checked = ({ label }) => (
  <View style={styles.checkedItem}>
    <View style={styles.checkedCircle}>
      <Text style={styles.checkedTick}>✓</Text>
    </View>
    <Text style={styles.checkedLabel} numberOfLines={2}>
      {label}
    </Text>
  </View>
);

const PropertyPageScreen = ({ navigation, route }) => {
  const property = route?.params?.property ?? {};
  const images = property.images?.length ? property.images : [IMAGES.house3, IMAGES.house2, IMAGES.house1];
  const facts = property.facts ?? DEFAULT_FACTS;
  const features = property.features?.length ? property.features : property.features ? [] : DEFAULT_FEATURES;
  const amenities = property.amenities?.length ? property.amenities : property.amenities ? [] : DEFAULT_AMENITIES;

  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // Turned off while the interest-rate slider is dragged.
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const heroRef = useRef(null);
  const indexRef = useRef(0);

  const goTo = (i) => {
    indexRef.current = i;
    setActive(i);
    heroRef.current?.scrollToOffset({ offset: i * W, animated: true });
  };

  const onScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / W);
    if (i !== indexRef.current && i >= 0 && i < images.length) {
      indexRef.current = i;
      setActive(i);
    }
  };

  const confirmDelete = () =>
    Alert.alert('Delete property', 'Are you sure you want to delete this property?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
    ]);

  const onMenu = (label) => {
    setMenuOpen(false);
    Alert.alert(label, `${label} will open here.`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={confirmDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <TrashIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconGap}
            onPress={() => Alert.alert('Edit', 'Edit property will open here.')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {ICONS.pencilSimple ? (
              <Image source={ICONS.pencilSimple} style={styles.headerIcon} resizeMode="contain" />
            ) : (
              <Text style={styles.plusText}>✎</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconGap}
            onPress={() => setMenuOpen((o) => !o)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScrollBeginDrag={() => setMenuOpen(false)}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <FlatList
            ref={heroRef}
            data={images}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            bounces={false}
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
            scrollEventThrottle={16}
            onScroll={onScroll}
            renderItem={({ item }) => <Image source={item} style={styles.heroImage} />}
          />
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === active ? styles.dotOn : styles.dotOff]} />
            ))}
          </View>
        </View>

        {/* Thumbnails */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbs}>
          {images.map((img, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.85}
              onPress={() => goTo(i)}
              style={[styles.thumb, i === active && styles.thumbActive]}
            >
              <Image source={img} style={styles.thumbImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title */}
        <View style={styles.block}>
          <Text style={styles.title}>{property.title ?? 'Kings Landing - House'}</Text>
          <View style={styles.addressRow}>
            <Text style={styles.address} numberOfLines={1}>
              {property.address ?? '1012 Ocean avenue, New York, USA'}
            </Text>
            <Text style={styles.views}>0 Views  •  0 Saves</Text>
          </View>
        </View>

        {/* Facts */}
        <View style={styles.facts}>
          {facts.map((f, i) => (
            <View key={`${f.label}-${i}`} style={styles.fact}>
              <Text style={styles.factLabel} numberOfLines={1}>
                {f.label}
              </Text>
              <Text style={styles.factValue} numberOfLines={1}>
                {f.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.block}>
          <Text style={styles.section}>Description</Text>
          <Text style={styles.description}>{property.description || DEFAULT_DESCRIPTION}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.block}>
          <Text style={styles.section}>Features</Text>
          <View style={styles.grid}>
            {features.map((f) => (
              <View key={f} style={styles.cell}>
                <Checked label={f} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.block}>
          <Text style={styles.section}>Amenities</Text>
          <View style={styles.grid}>
            {amenities.map((f) => (
              <View key={f} style={styles.cell}>
                <Checked label={f} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <AroundThisHome />

        <View style={styles.divider} />

        {/* Schools */}
        <View style={styles.block}>
          <Text style={styles.section}>Schools</Text>
          <Text style={styles.schoolsSubtitle}>Great Schools Summary Rating</Text>
          {SCHOOLS.map((school) => (
            <View key={school.name} style={styles.schoolRow}>
              <Text style={styles.schoolRating}>{school.rating}</Text>
              <View style={styles.schoolInfoCol}>
                <Text style={styles.schoolName}>{school.name}</Text>
                <Text style={styles.schoolInfo}>{school.info}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <OpenHouses />

        <View style={styles.divider} />

        <PaymentEstimate onSliderInteract={(active) => setScrollEnabled(!active)} />

        <ListingHistory />

        <LocationSection onExpand={() => navigation.navigate('MapViewScreen')} />
      </ScrollView>

      {/* "+" menu */}
      {menuOpen && (
        <>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            {MENU.map((m) => (
              <TouchableOpacity key={m.label} style={styles.menuItem} onPress={() => onMenu(m.label)}>
                {m.icon ? <Image source={m.icon} style={styles.menuIcon} resizeMode="contain" /> : null}
                <Text style={styles.menuText}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default PropertyPageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 14, color: TEXT },
  headerIcons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  iconGap: { marginLeft: 14 },
  headerIcon: { width: 16, height: 16, tintColor: TEXT },
  plusText: { fontSize: 20, lineHeight: 22, color: TEXT, fontFamily: FONT.regular },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  trash: { width: 14, height: 16, alignItems: 'center' },
  trashLid: { width: 14, height: 2, backgroundColor: TEXT, marginBottom: 1.5 },
  trashBody: {
    width: 10,
    height: 11,
    borderWidth: 1.5,
    borderColor: TEXT,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  content: { paddingBottom: 30 },

  hero: { width: W, height: HERO_H },
  heroImage: { width: W, height: HERO_H, resizeMode: 'cover' },
  dots: { position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row' },
  dot: { width: 5, height: 5, borderRadius: 3, marginHorizontal: 2 },
  dotOn: { backgroundColor: ORANGE },
  dotOff: { backgroundColor: '#FFFFFF' },

  thumbs: { paddingHorizontal: 8, paddingTop: 8 },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    marginRight: THUMB_GAP,
  },
  thumbActive: { borderColor: ORANGE },
  thumbImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  block: { paddingHorizontal: 16, marginTop: 12 },
  title: { fontFamily: FONT.semibold, fontSize: 13, color: '#000000' },
  addressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  address: { flex: 1, fontFamily: FONT.regular, fontSize: 8, color: '#6B6B6B' },
  views: { fontFamily: FONT.regular, fontSize: 7, color: '#8A8A8A' },

  facts: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginTop: 14 },
  fact: { width: '33.333%', marginBottom: 10, paddingRight: 6 },
  factLabel: { fontFamily: FONT.regular, fontSize: 7, color: '#8A8A8A', marginBottom: 1 },
  factValue: { fontFamily: FONT.medium, fontSize: 8.5, color: TEXT },

  divider: { height: 1, backgroundColor: '#ECECEC', marginHorizontal: 16, marginTop: 6 },

  section: { fontFamily: FONT.semibold, fontSize: 11, color: TEXT, marginBottom: 8 },
  description: { fontFamily: FONT.regular, fontSize: 9, lineHeight: 14, color: '#6B6B6B' },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33.333%', marginBottom: 12, paddingRight: 4 },
  checkedItem: { flexDirection: 'row', alignItems: 'center' },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  checkedTick: { color: '#FFFFFF', fontSize: 8, lineHeight: 10, fontWeight: '700' },
  checkedLabel: { flex: 1, fontFamily: FONT.regular, fontSize: 8, color: TEXT },

  mapBox: { height: 120, borderRadius: 10, overflow: 'hidden', backgroundColor: '#EAEAEA', marginTop: 2 },
  mapImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mapExpand: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapExpandText: { fontSize: 11, color: TEXT },

  schoolsSubtitle: { fontFamily: FONT.regular, fontSize: 9, color: '#6B6B6B', marginTop: -4, marginBottom: 12 },
  schoolRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  schoolRating: { width: 36, fontFamily: FONT.medium, fontSize: 10, color: TEXT },
  schoolInfoCol: { flex: 1 },
  schoolName: { fontFamily: FONT.medium, fontSize: 10, color: TEXT },
  schoolInfo: { fontFamily: FONT.regular, fontSize: 8, color: '#8A8A8A', marginTop: 1 },

  menu: {
    position: 'absolute',
    top: 52,
    right: 16,
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 12 },
  menuIcon: { width: 12, height: 12, marginRight: 8, tintColor: TEXT },
  menuText: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
});
