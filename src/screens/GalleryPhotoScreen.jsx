import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GALLERY_PHOTOS } from '../constants/galleryData';

const { width: W } = Dimensions.get('window');
const BG = '#151515';
const PHOTO_H = 244; // Figma image 375 x 244

const FONT = {
  medium: 'Poppins-Medium',
};

/** White "X" (Figma 24px icon, vector 15px) drawn with two bars. */
const CloseIcon = () => (
  <View style={styles.closeBox}>
    <View style={[styles.closeBar, { transform: [{ rotate: '45deg' }] }]} />
    <View style={[styles.closeBar, { transform: [{ rotate: '-45deg' }] }]} />
  </View>
);

/** Full screen photo viewer (dark). Swipe sideways to see the next photo. */
const GalleryPhotoScreen = ({ navigation, route }) => {
  const startIndex = route?.params?.index ?? 0;
  const [index, setIndex] = useState(startIndex);
  const indexRef = useRef(startIndex);

  const handleScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / W);
    if (i !== indexRef.current && i >= 0 && i < GALLERY_PHOTOS.length) {
      indexRef.current = i;
      setIndex(i);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Header 375 x 52 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <CloseIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery View</Text>
        <Text style={styles.counter}>
          {index + 1}/{GALLERY_PHOTOS.length}
        </Text>
      </View>

      <FlatList
        data={GALLERY_PHOTOS}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={startIndex}
        getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Image source={item.source} style={styles.photo} />
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 15,
    top: 14,
    width: 24,
    height: 24,
  },
  closeBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBar: {
    position: 'absolute',
    width: 21,
    height: 2.25,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: FONT.medium,
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  counter: {
    position: 'absolute',
    right: 15,
    top: 16,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  list: { flex: 1 },

  // Image top is Figma 243 -> 147 below the header (header ends at 96)
  page: { width: W, paddingTop: 147 },
  photo: {
    width: W,
    height: PHOTO_H,
    resizeMode: 'cover',
    backgroundColor: '#000000',
  },
  // label top 506 = 19 below the image
  caption: {
    marginTop: 19,
    marginLeft: 15,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 22,
    color: '#DCDCDC',
    includeFontPadding: false,
  },
});

export default GalleryPhotoScreen;
