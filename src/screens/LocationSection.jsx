import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IMAGES } from '../assets';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

/**
 * "Location": title 14/500, map frame 345 x 215 (radius 12),
 * white expand button 29 x 29 at the top right of the map.
 *
 * Put the exported Figma crop at src/assets/images/locationMap.png and add
 * `locationMap: require('./images/locationMap.png')` to IMAGES.
 * Until then the big Explore map image is used (or a plain placeholder).
 */
const LocationSection = ({ onExpand }) => {
  const mapImage = IMAGES.locationMap || IMAGES.map;

  return (
    <View>
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
          <Image
            source={require('../assets/icons/ExpandMap.png')}
            style={styles.expandIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#303131',
    includeFontPadding: false,
  },
  mapBox: {
    height: 215,
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
    fontSize: 24,
    color: '#000000',
  },
  // Figma button: 29.22 x 28.75, white, small radius
  expandButton: {
    position: 'absolute',
    top: 14,
    right: 6,
    width: 29,
    height: 29,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // icon is black already (no tint); 20 box with a 16px glyph
  expandIcon: {
    width: 20,
    height: 20,
    
  },
});

export default LocationSection;
