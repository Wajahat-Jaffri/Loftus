import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import PropertyCard from './PropertyCard';
import BottomNav from '../components/BottomNav';
import ScreenHeader from '../components/ScreenHeader';
import SearchRow from '../components/SearchRow';
import { PROPERTIES } from '../constants/dummyData';

const SORT_ICON = require('../assets/icons/SortAscending.png');

const ORANGE = '#FF6C40';
const GREY_TEXT = '#515151';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};

/*
 * DEMO ONLY: the Figma frame shows "Open House" on card 2 and 3, a "Promotion" pill and a price
 * range on card 3. Put `openHouse`, `promotion` and `priceRange` on the items in dummyData
 * (or the API) and set this to false.
 */
const SHOW_FIGMA_DEMO_FLAGS = true;
const withDemoFlags = (item, i) =>
  SHOW_FIGMA_DEMO_FLAGS
    ? {
        ...item,
        offers: item.offers ?? 3,
        openHouse: item.openHouse ?? i >= 1,
        promotion: item.promotion ?? i === 2,
        priceRange: item.priceRange ?? (i === 2 ? '$123,000-$102,000' : undefined),
      }
    : item;

const priceNumber = (p) => parseInt(String(p?.priceRange || p?.price || '').replace(/[^0-9]/g, ''), 10) || 0;

/* Figma toggle: 115 x 30, 1px #DEDEDE border, radius 80; the orange pill is 57 x 30 */
const BuyRentToggle = ({ value, onChange }) => {
  const isBuy = value === 'buy';
  return (
    <View style={styles.toggle}>
      <View style={[styles.togglePill, { left: isBuy ? -1 : 57 }]} />
      <TouchableOpacity style={styles.toggleHalf} activeOpacity={0.8} onPress={() => onChange('buy')}>
        <Text style={isBuy ? styles.toggleTextOn : styles.toggleText}>Buy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleHalf} activeOpacity={0.8} onPress={() => onChange('rent')}>
        <Text style={!isBuy ? styles.toggleTextOn : styles.toggleText}>Rent</Text>
      </TouchableOpacity>
    </View>
  );
};

/* Figma ChevronDown: 14 x 14 box */
const ChevronDown = () => (
  <View style={styles.chevronBox}>
    <View style={styles.chevron} />
  </View>
);

const PropertyListingScreen = ({ navigation }) => {
  const [mode, setMode] = useState('buy'); // 'buy' | 'rent'
  const [sort, setSort] = useState(null); // null | 'asc' | 'desc' (by price)

  const data = PROPERTIES.map(withDemoFlags)
    .filter((p) => {
      const t = String(p.type || p.listingType || '').toLowerCase();
      if (!t) return true;
      return mode === 'buy' ? t === 'sale' || t === 'buy' : t === 'rent';
    })
    .sort((a, b) =>
      sort === 'asc' ? priceNumber(a) - priceNumber(b) : sort === 'desc' ? priceNumber(b) - priceNumber(a) : 0
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title="Search" onBack={() => navigation?.goBack()} />

      {/* Search + filter (Figma top 108) */}
      <View style={styles.searchWrap}>
        <SearchRow
          editable={false}
          onPressSearch={() => navigation?.navigate('MapViewScreen')}
          onPressFilter={() => navigation?.navigate('Filters')}
        />
      </View>

      {/* Buy / Rent + Price + Sort (Figma top 164, 30 high) */}
      <View style={styles.controlsRow}>
        <BuyRentToggle value={mode} onChange={setMode} />

        <View style={styles.controlsRight}>
          <TouchableOpacity
            style={styles.pricePill}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Filters')}
          >
            <Text style={styles.pillText}>Price</Text>
            <ChevronDown />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortPill}
            activeOpacity={0.8}
            onPress={() => setSort((v) => (v === null ? 'asc' : v === 'asc' ? 'desc' : null))}
          >
            <Image
              source={SORT_ICON}
              style={[styles.sortIcon, sort === 'desc' && { transform: [{ scaleY: -1 }] }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed (cards start at Figma top 221) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.feedList}>
        {data.map((property) => (
          <PropertyCard
            key={String(property.id)}
            item={property}
            onPressItem={(p) => navigation?.navigate('PropertyDetailsScreen', { property: p })}
          />
        ))}
      </ScrollView>

      <BottomNav active="Explore" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },

  // 52 header -> 12 gap -> search row (44)
  searchWrap: { marginTop: 12 },

  // search ends at 152, controls at 164
  controlsRow: {
    height: 30,
    marginTop: 12,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toggle: {
    width: 115,
    height: 30,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  togglePill: {
    position: 'absolute',
    top: -1,
    width: 57,
    height: 30,
    borderRadius: 80,
    backgroundColor: ORANGE,
  },
  toggleHalf: {
    width: 56.5,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: ORANGE,
    opacity: 0.6,
    includeFontPadding: false,
  },
  toggleTextOn: {
    fontFamily: FONT.semi,
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  controlsRight: { flexDirection: 'row', alignItems: 'center' },
  pricePill: {
    width: 63,
    height: 30,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 50,
    paddingHorizontal: 7, // Figma 8 minus the border
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: GREY_TEXT,
    marginRight: 4,
    includeFontPadding: false,
  },
  chevronBox: { width: 14, height: 14, alignItems: 'center', justifyContent: 'center' },
  chevron: {
    width: 5.5,
    height: 5.5,
    borderRightWidth: 1.4,
    borderBottomWidth: 1.4,
    borderColor: GREY_TEXT,
    transform: [{ rotate: '45deg' }, { translateY: -1.5 }],
  },
  sortPill: {
    width: 52,
    height: 30,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortIcon: { width: 20, height: 20, tintColor: GREY_TEXT },

  // controls end at 194, first card at 221
  feedList: {
    paddingTop: 27,
    paddingHorizontal: 15,
    paddingBottom: 8,
  },
});

export default PropertyListingScreen;
