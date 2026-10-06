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
const BG = '#1B1B1B';
const PHOTO_H = Math.round(W * 0.6);

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

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

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeIcon}>✕</Text>
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
            <View style={styles.photoBox}>
              <Image source={item.source} style={styles.photo} />
            </View>
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
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  closeIcon: { color: '#FFFFFF', fontSize: 16, fontFamily: FONT.regular },
  headerTitle: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: '#FFFFFF',
  },
  counter: {
    position: 'absolute',
    right: 16,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#FFFFFF',
  },
  list: { flex: 1 },
  page: { width: W, paddingTop: 36 },
  photoBox: { width: W, height: PHOTO_H, backgroundColor: '#000' },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  caption: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 16,
  },
});

export default GalleryPhotoScreen;
