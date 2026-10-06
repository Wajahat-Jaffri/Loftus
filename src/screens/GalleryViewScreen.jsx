import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { GALLERY_SECTIONS, GALLERY_PHOTOS } from '../constants/galleryData';

const ORANGE = '#FF6C40';
const { width: W } = Dimensions.get('window');

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const GAP = 3;
const BIG_H = Math.round(W * 0.56);
const HALF_W = (W - GAP) / 2;
const ROW_H = Math.round(HALF_W * 0.72);
const GRID_H = Math.round(HALF_W * 0.8);
const TOP_THUMB_W = Math.round((W - 40 - 20) / 3);

const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

const GalleryViewScreen = ({ navigation, route }) => {
  const property = route?.params?.property;
  const title = property?.title ?? 'Kings Landing - House';
  const address = property?.address ?? '100 Ocean avenue, New York, USA';

  const scrollRef = useRef(null);
  const sectionY = useRef({});

  const scrollToSection = (key) => {
    const y = sectionY.current[key];
    if (y != null) scrollRef.current?.scrollTo({ y, animated: true });
  };

  const openPhoto = (section, indexInSection) => {
    let start = 0;
    for (const s of GALLERY_SECTIONS) {
      if (s.key === section.key) break;
      start += s.images.length;
    }
    navigation?.navigate('GalleryPhotoScreen', { index: start + indexInSection });
  };

  const Photo = ({ section, i, style }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => openPhoto(section, i)} style={style}>
      <Image source={section.images[i]} style={styles.fill} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery View</Text>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* Property name + room shortcuts */}
        <View style={styles.intro}>
          <Text style={styles.propertyTitle}>{title}</Text>
          <Text style={styles.propertyAddress}>{address}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roomsRow}
          >
            {GALLERY_SECTIONS.map((s) => (
              <TouchableOpacity
                key={s.key}
                activeOpacity={0.85}
                style={styles.roomItem}
                onPress={() => scrollToSection(s.key)}
              >
                <Image source={s.images[0]} style={styles.roomThumb} />
                <Text style={styles.roomLabel} numberOfLines={1}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sections */}
        {GALLERY_SECTIONS.map((section) => {
          const rest = section.images.slice(1).map((_, k) => k + 1);
          const rows = chunk(rest, 2);
          const isGrid = section.images.length > 4; // kitchen = 2 x 2 grid
          return (
            <View
              key={section.key}
              onLayout={(e) => {
                sectionY.current[section.key] = e.nativeEvent.layout.y;
              }}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>

              <Photo section={section} i={0} style={{ width: W, height: BIG_H }} />

              {rows.map((row, r) => (
                <View key={r} style={[styles.row, { marginTop: GAP }]}>
                  {row.map((idx, c) => (
                    <Photo
                      key={idx}
                      section={section}
                      i={idx}
                      style={{
                        width: HALF_W,
                        height: isGrid ? GRID_H : ROW_H,
                        marginLeft: c === 0 ? 0 : GAP,
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          );
        })}

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNav active="" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  fill: { width: '100%', height: '100%', resizeMode: 'cover' },

  header: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 30,
    lineHeight: 32,
    color: '#1A1A1A',
    fontFamily: FONT.regular,
  },
  headerTitle: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: '#1A1A1A',
  },

  intro: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 6 },
  propertyTitle: {
    fontFamily: FONT.semibold,
    fontSize: 16,
    color: '#1A1A1A',
  },
  propertyAddress: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#8A8A8A',
    marginTop: 2,
  },
  roomsRow: { paddingTop: 12 },
  roomItem: { width: TOP_THUMB_W, marginRight: 10 },
  roomThumb: {
    width: TOP_THUMB_W,
    height: Math.round(TOP_THUMB_W * 0.62),
    borderRadius: 6,
    resizeMode: 'cover',
  },
  roomLabel: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#1A1A1A',
    marginTop: 4,
  },

  sectionTitle: {
    fontFamily: FONT.semibold,
    fontSize: 16,
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  row: { flexDirection: 'row' },
});

export default GalleryViewScreen;
