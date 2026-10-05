import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { ICONS, IMAGES } from '../assets';

const ORANGE = '#FF6C40';
const GREY = '#9E9E9E';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

// The exported Figma map (src/assets/images/map.png) is 345 x 573 and already
// contains the "New York" label, the orange pins and the result pill.
const MAP_W = 345;
const MAP_H = 573;

// Pin tip positions in the map image's own pixels. We only place invisible
// tap areas here so a tap can show the property's tooltip.
const MAP_PINS = [
  { id: 'p1', x: 132, y: 38, title: 'Kings Landing', price: '$102,000' },
  { id: 'p2', x: 83, y: 80, title: 'Modern Arch. Home', price: '$185,000' },
  { id: 'p3', x: 226, y: 176, title: 'Sweet Home Cottage', price: '$96,500' },
  { id: 'p4', x: 124, y: 430, title: 'Lakeview Villa', price: '$240,000' },
  { id: 'p5', x: 151, y: 415, title: 'City Loft', price: '$130,000' },
  { id: 'p6', x: 151, y: 468, title: 'Garden Flat', price: '$88,000' },
];

const HIT = 40; // tap target size

const MapViewScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // The image is drawn with resizeMode "cover"; compute the same scale/offset
  // so the tap areas stay exactly on top of the pins on any screen size.
  const scale = box.w && box.h ? Math.max(box.w / MAP_W, box.h / MAP_H) : 1;
  const offsetX = (box.w - MAP_W * scale) / 2;
  const offsetY = (box.h - MAP_H * scale) / 2;

  const handlePinPress = (id) =>
    setSelectedPin((prev) => (prev === id ? null : id));

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
        <View style={styles.searchInputContainer}>
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
            returnKeyType="search"
          />
        </View>

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

      {/* Map */}
      <View
        style={styles.mapWrapper}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setBox({ w: width, h: height });
        }}
      >
        {/* Tap the map background to close the tooltip */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setSelectedPin(null)}
        >
          {IMAGES.map ? (
            <Image source={IMAGES.map} style={styles.mapImage} />
          ) : (
            <View style={styles.mapPlaceholder} />
          )}
        </Pressable>

        {box.w > 0 &&
          MAP_PINS.map((pin) => {
            const cx = offsetX + pin.x * scale;
            const cy = offsetY + pin.y * scale;
            const selected = selectedPin === pin.id;

            return (
              <Pressable
                key={pin.id}
                onPress={() => handlePinPress(pin.id)}
                style={[
                  styles.pinHit,
                  {
                    left: cx - HIT / 2,
                    // pin tip is at (x, y); the pin body sits just above it
                    top: cy - HIT + 6,
                  },
                  selected && styles.pinHitSelected,
                ]}
              >
                {selected && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle} numberOfLines={1}>
                      {pin.title}
                    </Text>
                    <Text style={styles.tooltipPrice}>{pin.price}</Text>
                    <View style={styles.tooltipArrow} />
                  </View>
                )}
              </Pressable>
            );
          })}
      </View>

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

  // Map
  mapWrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E8EEF2',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#DDE7EE',
  },

  // Invisible tap areas over the pins baked into the map image
  pinHit: {
    position: 'absolute',
    width: HIT,
    height: HIT,
    alignItems: 'center',
  },
  pinHitSelected: {
    zIndex: 10,
  },
  tooltip: {
    position: 'absolute',
    bottom: HIT - 4,
    minWidth: 104,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  tooltipTitle: {
    fontFamily: FONT.medium,
    fontSize: 9,
    color: '#1A1A1A',
  },
  tooltipPrice: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: ORANGE,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
});

export default MapViewScreen;
