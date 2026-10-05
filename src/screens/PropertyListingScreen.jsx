import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import PropertyCard from './PropertyCard';
import BottomNav from '../components/BottomNav';
import { PROPERTIES, CATEGORIES } from '../constants/dummyData';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const GREY = '#9E9E9E';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const PropertyListingScreen = ({ navigation }) => {
  // Figma default: no pill is filled. Tap a pill to select, tap again to clear.
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState('');

  const handleCategoryPress = (cat) =>
    setSelectedCategory((prev) => (prev === cat ? null : cat));

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
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search + filter */}
      <View style={styles.searchSection}>
        <TouchableOpacity
          style={styles.searchInputContainer}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('MapViewScreen')}
        >
          <View style={styles.searchInner} pointerEvents="none">
            <Image
              source={ICONS.search}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by Address, City, or ZIP"
              placeholderTextColor={GREY}
              style={styles.searchInput}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('Filters')}
        >
          <View style={styles.filterLinesContainer}>
            <View style={[styles.filterLine, { width: 20 }]} />
            <View style={[styles.filterLine, { width: 14 }]} />
            <View style={[styles.filterLine, { width: 8 }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Category pills */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.8}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Feed */}
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

      {/* Bottom nav */}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  backButton: {
    width: 24,
  },
  backChevron: {
    fontSize: 30,
    lineHeight: 34,
    color: '#1A1A1A',
    fontWeight: '300',
  },
  headerTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: '#1A1A1A',
  },
  headerSpacer: {
    width: 24,
  },

  // Search
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 14,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 22,
    height: 40,
    paddingHorizontal: 14,
    marginRight: 14,
  },
  searchInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 16,
    height: 16,
    tintColor: GREY,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#1A1A1A',
    paddingVertical: 0,
  },
  filterButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterLinesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLine: {
    height: 2,
    backgroundColor: ORANGE,
    borderRadius: 1,
    marginVertical: 2,
  },

  // Categories
  categoriesContainer: {
    marginBottom: 14,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ORANGE,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  categoryPillSelected: {
    backgroundColor: ORANGE,
  },
  categoryText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: ORANGE,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },

  // Feed
  feedList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 62,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  bottomNavIcon: {
    width: 22,
    height: 22,
    marginBottom: 3,
  },
  navFallbackIcon: {
    fontSize: 20,
    lineHeight: 24,
    color: GREY,
    marginBottom: 1,
  },
  navLabelInactive: {
    fontFamily: FONT.regular,
    fontSize: 9,
    color: GREY,
  },
  navLabelActive: {
    fontFamily: FONT.medium,
    fontSize: 9,
    color: ORANGE,
  },
});

export default PropertyListingScreen;
