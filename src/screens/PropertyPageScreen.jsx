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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '../assets';
import ScreenHeader from '../components/ScreenHeader';
import { MapCard } from '../components/AddPropertyParts';
import BottomActionBar from './BottomActionBar';

const ORANGE = '#FF6C40';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const ICON = {
  trash: require('../assets/icons/PropTrash.png'),
  pencil: require('../assets/icons/PropPencil.png'),
  plus: require('../assets/icons/PropPlus.png'),
  check: require('../assets/icons/Check.png'),
};

const { width: W } = Dimensions.get('window');
const HERO_H = 305;

/* ------------------------------------------------------------------ */
/* Default data (used when route.params.property has nothing)           */
/* ------------------------------------------------------------------ */
const DEFAULT_COLUMNS = [
  [
    ['Deposit', '$2,424'],
    ['Entire Home', 'No'],
    ['Property Type', 'Townhouse'],
    ['Laundry', 'In Unit'],
    ['Air Conditioning', 'Ductless'],
  ],
  [
    ['Lease Term', '12'],
    ['Year Built', '2023'],
    ['House Style', 'Ranch'],
    ['Flooring', 'Hardwood'],
    ['Heating', 'No'],
  ],
  [
    ['Available Date', '27, Jan 2025'],
    ['Lot Size', '1,345 SF'],
    ['Nearest Metro', '1 mi'],
    ['Countertop Type', 'Marble'],
  ],
];
const COLUMN_WIDTHS = [85.89, 111.16, 99.03];

const DEFAULT_FEATURES = [
  ['Attic', 'Basement', 'Pool'],
  ['Loft', 'Sunroom', 'Backyard'],
  ['Deck', 'Patio', 'Front yard'],
  ['Dishwasher', 'Disposal', 'Microwave'],
  ['Ice Dispenser', 'Oven', 'Furnished'],
  ['Den', 'Balcony', 'Pet Friendly'],
];
// [label, wrapWidth] - labels that wrap onto two lines in Figma get a width.
const DEFAULT_AMENITIES = [
  [['Fitness Center', 58], ['Business Center', 59], ['Clubhouse']],
  [['Game Room'], ['Dog Park'], ['Concierge']],
  [['Package service', 61, 105], ['Elevator', undefined, 101]],
];
const DEFAULT_DESCRIPTION =
  "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident";

const MENU = ['Lease', 'Sale Listing', 'Rental Listing', 'Service Staff'];

/* ------------------------------------------------------------------ */
/* Small pieces                                                         */
/* ------------------------------------------------------------------ */
const Tile = ({ label, value, last }) => (
  <View style={[styles.tile, !last && styles.tileGap]}>
    <Text style={styles.tileLabel}>{label}</Text>
    <Text style={styles.tileValue}>{value}</Text>
  </View>
);

const Chip = ({ label, wrapWidth, tall }) => (
  <View style={[styles.chip, tall && styles.chipTall]}>
    <View style={styles.chipCircle}>
      <Image source={ICON.check} style={styles.chipCheck} resizeMode="contain" />
    </View>
    <Text style={[styles.chipLabel, wrapWidth ? { width: wrapWidth } : null]}>{label}</Text>
  </View>
);

const Line = ({ bottom = 15 }) => <View style={[styles.line, { marginBottom: bottom }]} />;

/* ------------------------------------------------------------------ */
/* Screen                                                               */
/* ------------------------------------------------------------------ */
const PropertyPageScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const property = route?.params?.property ?? {};
  const images = property.images?.length
    ? property.images
    : [IMAGES.house3, IMAGES.house2, IMAGES.house1, IMAGES.house3, IMAGES.house2];

  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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
      { text: 'Delete', style: 'destructive', onPress: () => navigation?.goBack() },
    ]);

  const onMenu = (label) => {
    setMenuOpen(false);
    Alert.alert(label, `${label} will open here.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader
        title="Property"
        onBack={() => navigation?.goBack()}
        right={
          <>
            <TouchableOpacity
              onPress={confirmDelete}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              <Image source={ICON.trash} style={styles.headerIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerGap}
              onPress={() => Alert.alert('Edit', 'Edit property will open here.')}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              <Image source={ICON.pencil} style={styles.headerIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerGap}
              onPress={() => setMenuOpen((o) => !o)}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              <Image
                source={ICON.plus}
                style={[styles.headerIcon, { tintColor: '#444444' }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </>
        }
      />

      <ScrollView
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

        {/* Thumbnails: 104 x 100, radius 8, selected = 2px orange border */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbs}
          style={styles.thumbsScroll}
        >
          {images.map((img, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.85}
              onPress={() => goTo(i)}
              style={[styles.thumb, i === images.length - 1 && { marginRight: 0 }]}
            >
              <Image source={img} style={styles.thumbImage} />
              {i === active ? <View pointerEvents="none" style={styles.thumbBorder} /> : null}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title + address + views */}
        <View style={styles.pad}>
          <Text style={styles.title}>{property.title ?? 'Kings Landing - House'}</Text>
          <Text style={styles.address}>
            {property.address ?? '1012 Ocean avanue, New York, USA'}
          </Text>
          <View style={styles.viewsRow}>
            <Text style={styles.views}>{property.views ?? 0} Views</Text>
            <View style={styles.viewsDot} />
            <Text style={styles.views}>{property.saves ?? 0} Save</Text>
          </View>
        </View>

        {/* Tiles */}
        <View style={[styles.pad, { marginTop: 21 }]}>
          <View style={styles.tiles}>
            {(property.columns ?? DEFAULT_COLUMNS).map((col, c) => (
              <View key={c} style={{ width: COLUMN_WIDTHS[c] }}>
                {col.map(([label, value], r) => (
                  <Tile key={label} label={label} value={value} last={r === col.length - 1} />
                ))}
              </View>
            ))}
          </View>

          <Line bottom={15} />

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.description}>{property.description || DEFAULT_DESCRIPTION}</Text>
          </View>

          <Line bottom={15} />

          {/* Features */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Features</Text>
            <View style={styles.chipRows}>
              {(property.featureRows ?? DEFAULT_FEATURES).map((row, r) => (
                <View key={r} style={[styles.chipRow, r > 0 && { marginTop: 10 }]}>
                  {row.map((label, i) => (
                    <View
                      key={label}
                      style={[styles.chipCell, i < row.length - 1 && styles.chipCellGap]}
                    >
                      <Chip label={label} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

          <Line bottom={15} />

          {/* Amenities */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Amenities</Text>
            <View style={styles.chipRows}>
              {(property.amenityRows ?? DEFAULT_AMENITIES).map((row, r) => {
                const tall = row.some(([, w]) => !!w);
                return (
                  <View key={r} style={[styles.chipRow, r > 0 && { marginTop: 10 }]}>
                    {row.map(([label, w, cw], i) => (
                      <View
                        key={label}
                        style={[
                          cw ? { width: cw } : styles.chipCell,
                          i < row.length - 1 && styles.chipCellGap,
                        ]}
                      >
                        <Chip label={label} wrapWidth={w} tall={tall} />
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>

          <Line bottom={23} />

          <Text style={styles.cardTitle}>Location</Text>
          <MapCard style={styles.locMap} onExpand={() => navigation?.navigate('MapViewScreen')} />
        </View>
      </ScrollView>

      <BottomActionBar />

      {/* "+" menu (Figma: 162 x 196, 5px below the header, right edge 14) */}
      {menuOpen ? (
        <>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />
          <View style={[styles.menu, { top: insets.top + 57 }]}>
            {MENU.map((label) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.7}
                style={styles.menuItem}
                onPress={() => onMenu(label)}
              >
                <Image source={ICON.plus} style={styles.menuIcon} resizeMode="contain" />
                <Text style={styles.menuText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default PropertyPageScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 21 },
  pad: { paddingHorizontal: 15 },

  /* header */
  headerIcon: { width: 24, height: 24 },
  headerGap: { marginLeft: 16 },

  /* hero */
  hero: { width: W, height: HERO_H },
  heroImage: { width: W, height: HERO_H, resizeMode: 'cover' },
  dots: {
    position: 'absolute',
    bottom: 11,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { borderRadius: 5, marginHorizontal: 2 },
  dotOn: { width: 9, height: 9, backgroundColor: ORANGE },
  dotOff: { width: 7, height: 7, backgroundColor: '#FFFFFF' },

  /* thumbnails */
  thumbsScroll: { marginTop: 18, flexGrow: 0 },
  thumbs: { paddingHorizontal: 15 },
  thumb: {
    width: 104,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  thumbImage: { width: 104, height: 100, resizeMode: 'cover' },
  thumbBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 8,
  },

  /* title block (natural line heights, offsets via margins) */
  title: {
    marginTop: 19.5,
    fontFamily: FONT.semibold,
    fontSize: 18,
    lineHeight: 26,
    color: '#000000',
    includeFontPadding: false,
  },
  address: {
    marginTop: 4.5,
    marginLeft: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 17,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  viewsRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  views: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 17,
    color: '#7A7A7A',
    includeFontPadding: false,
  },
  viewsDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#7A7A7A',
    marginHorizontal: 4,
  },

  /* tiles */
  tiles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 8,
  },
  tile: {},
  tileGap: { marginBottom: 15 },
  tileLabel: {
    fontFamily: FONT.medium,
    fontSize: 10,
    lineHeight: 15,
    color: '#7A7A7A',
    includeFontPadding: false,
  },
  tileValue: {
    marginTop: 2,
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },

  locMap: { marginTop: 10 },
  line: { height: 1, backgroundColor: '#DFDFDF', marginTop: 16 },

  /* cards */
  card: { padding: 8, borderRadius: 8 },
  cardTitle: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#303131',
    includeFontPadding: false,
  },
  description: {
    marginTop: 12,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#3D3D3D',
    includeFontPadding: false,
  },

  /* chips */
  chipRows: { marginTop: 12 },
  chipRow: { flexDirection: 'row', alignItems: 'center' },
  chipCell: { flex: 1 },
  chipCellGap: { marginRight: 8 },
  chip: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  chipTall: { minHeight: 46 },
  chipCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chipCheck: { width: 12.5, height: 12.5, tintColor: '#FFFFFF' },
  chipLabel: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#5B5B5B',
    includeFontPadding: false,
  },

  /* "+" menu */
  menu: {
    position: 'absolute',
    right: 14,
    width: 162,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  menuItem: {
    height: 49,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  menuIcon: { width: 17, height: 17, marginRight: 8, tintColor: '#404040' },
  menuText: {
    fontFamily: FONT.regular,
    fontSize: 16,
    lineHeight: 22,
    color: '#404040',
    includeFontPadding: false,
  },
});
