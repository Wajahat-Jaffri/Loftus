import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import ScreenHeader from '../components/ScreenHeader';
import SearchRow from '../components/SearchRow';
import { IMAGES } from '../assets';

const ORANGE = '#FF6C40';

const FONT = {
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

      <ScreenHeader title="Search" onBack={() => navigation?.goBack()} />

      {/* Search + filter (Figma top 108) */}
      <View style={styles.searchWrap}>
        <SearchRow
          value={query}
          onChangeText={setQuery}
          onPressFilter={() => navigation?.navigate('Filters')}
        />
      </View>

      {/* Map frame: 345 x 573, radius 12, Figma top 168 */}
      <View
        style={styles.mapWrapper}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setBox({ w: width, h: height });
        }}
      >
        {/* Tap the map background to close the tooltip */}
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedPin(null)}>
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

  // 52 header -> 12 gap -> search row (44) -> 16 gap -> map
  searchWrap: {
    marginTop: 12,
  },
  mapWrapper: {
    height: MAP_H,
    marginTop: 16,
    marginHorizontal: 15,
    borderRadius: 12,
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
