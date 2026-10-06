import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ICONS, IMAGES } from '../assets';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

const { width: SCREEN_W } = Dimensions.get('window');
const MAP_H = Math.round((SCREEN_W - 40) * 0.5);

/**
 * "Location" — a small map preview with an expand button.
 * Put the exported Figma crop at src/assets/images/locationMap.png and add
 * `locationMap: require('./images/locationMap.png')` to IMAGES.
 * Until then a plain placeholder is shown.
 */
const LocationSection = ({ onExpand }) => {
  const mapImage = IMAGES.locationMap;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Location</Text>

      <View style={styles.mapBox}>
        {mapImage ? (
          <Image source={mapImage} style={styles.mapImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>New York</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.expandButton}
          activeOpacity={0.8}
          onPress={onExpand}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {ICONS.expand ? (
            <Image source={ICONS.expand} style={styles.expandIcon} resizeMode="contain" />
          ) : (
            <Text style={styles.expandGlyph}>⤢</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  title: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#1A1A1A',
    marginBottom: 10,
  },
  mapBox: {
    height: MAP_H,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E8EEF2',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDE7EE',
  },
  placeholderText: {
    fontFamily: FONT.regular,
    fontSize: 18,
    color: '#1A1A1A',
  },
  expandButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIcon: {
    width: 14,
    height: 14,
    tintColor: '#1A1A1A',
  },
  expandGlyph: {
    fontSize: 14,
    lineHeight: 16,
    color: '#1A1A1A',
  },
});

export default LocationSection;
