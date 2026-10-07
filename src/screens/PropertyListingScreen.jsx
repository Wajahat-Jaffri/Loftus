import React, { useState } from 'react';
import {
  View,
  Text,
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
import { PROPERTIES, CATEGORIES } from '../constants/dummyData';

const ORANGE = '#FF6C40';

const FONT = {
  medium: 'Poppins-Medium',
};

const PropertyListingScreen = ({ navigation }) => {
  // Figma default: no pill is filled. Tap a pill to select, tap again to clear.
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = (cat) =>
    setSelectedCategory((prev) => (prev === cat ? null : cat));

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

      {/* Category pills (Figma top 164, 27 high, gap 8) */}
      <View style={styles.chipsBox}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.8}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Feed (cards start at Figma top 215) */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
      >
        <PropertyCard
          items={PROPERTIES}
          onPressItem={(property) =>
            navigation?.navigate('PropertyDetailsScreen', { property })
          }
        />
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
  searchWrap: {
    marginTop: 12,
  },

  // search ends at 152, chips at 164
  chipsBox: {
    height: 27,
    marginTop: 16,
  },
  chipsContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  chip: {
    height: 27,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: ORANGE,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: ORANGE,
  },
  chipText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: ORANGE,
    includeFontPadding: false,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },

  // chips end at 191, first card at 215
  feedList: {
    paddingTop: 24,
    paddingHorizontal: 15,
    paddingBottom: 8,
  },
});

export default PropertyListingScreen;
