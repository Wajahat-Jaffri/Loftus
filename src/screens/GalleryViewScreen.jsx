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
import ScreenHeader from '../components/ScreenHeader';
import { GALLERY_SECTIONS } from '../constants/galleryData';

const { width: W } = Dimensions.get('window');

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const GAP = 8; // gap between photos
const BIG_H = 244; // first photo of each room: 375 x 244
const ROW_H = 127; // photos in the pairs: 127 high
const HALF_W = (W - GAP) / 2;

const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

// Small dark badge ("Bed 1", "Bath 2") shown on bedroom / bathroom photos.
const badgeFor = (section, i) => {
  const key = String(section.key || '').toLowerCase();
  if (key.includes('bed')) return `Bed ${i + 1}`;
  if (key.includes('bath')) return `Bath ${i + 1}`;
  return null;
};

const GalleryViewScreen = ({ navigation, route }) => {
  const property = route?.params?.property;
  const title = property?.title ?? 'Kings Landing - House';
  const address = property?.address ?? '1012 Ocean avanue, New York, USA';

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

  const renderPhoto = (section, i, style) => {
    const badge = badgeFor(section, i);
    return (
      <TouchableOpacity
        key={i}
        activeOpacity={0.9}
        onPress={() => openPhoto(section, i)}
        style={style}
      >
        <Image source={section.images[i]} style={styles.fill} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Gallery View" onBack={() => navigation?.goBack()} />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* Title + address (Figma top 112) */}
        <View style={styles.intro}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.propertyAddress} numberOfLines={1}>
            {address}
          </Text>
        </View>

        {/* Room shortcuts (Figma top 166): thumbs 136 x 130, gap 16 */}
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.roomsScroll}
          contentContainerStyle={styles.roomsRow}
        >
          {GALLERY_SECTIONS.map((s, i) => (
            <TouchableOpacity
              key={s.key}
              activeOpacity={0.85}
              style={[styles.roomItem, i < GALLERY_SECTIONS.length - 1 && { marginRight: 16 }]}
              onPress={() => scrollToSection(s.key)}
            >
              <Image source={s.images[0]} style={styles.roomThumb} />
              <Text style={styles.roomLabel} numberOfLines={1}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* Sections */}
        {GALLERY_SECTIONS.map((section, sIndex) => {
          const rest = section.images.slice(1).map((_, k) => k + 1);
          const rows = chunk(rest, 2);
          return (
            <View
              key={section.key}
              style={sIndex === 0 ? styles.firstSection : styles.section}
              onLayout={(e) => {
                sectionY.current[section.key] = e.nativeEvent.layout.y;
              }}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>

              {renderPhoto(section, 0, { width: W, height: BIG_H })}

              {rows.map((row, r) => (
                <View key={r} style={[styles.row, { marginTop: GAP }]}>
                  {row.map((idx, c) =>
                    renderPhoto(section, idx, {
                      width: row.length === 1 ? HALF_W : HALF_W,
                      height: ROW_H,
                      marginLeft: c === 0 ? 0 : GAP,
                    })
                  )}
                </View>
              ))}
            </View>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomNav active="" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  fill: { width: '100%', height: '100%', resizeMode: 'cover' },

  // header ends at Figma 96, title block at 112 (height 38)
  intro: {
    height: 38,
    marginTop: 16,
    marginHorizontal: 15,
  },
  propertyTitle: {
    marginTop: -4,
    fontFamily: FONT.semibold,
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },
  propertyAddress: {
    marginTop: 7,
    marginLeft: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#4E4E4E',
    includeFontPadding: false,
  },

  // title block ends at 150, rooms at 166
  roomsScroll: {
    flexGrow: 0,
    marginTop: 16,
  },
  roomsRow: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  roomItem: { width: 136, height: 161 },
  roomThumb: {
    width: 136,
    height: 130,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  roomLabel: {
    marginTop: 10,
    height: 21,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#3D3D3D',
    includeFontPadding: false,
  },

  // rooms end at 327, divider at 351
  divider: {
    height: 1,
    marginTop: 24,
    marginHorizontal: 15,
    backgroundColor: '#DFDFDF',
  },

  // divider ends 352, first section at 374; later sections 48 apart
  firstSection: { marginTop: 22 },
  section: { marginTop: 48 },
  sectionTitle: {
    marginTop: -4.5,
    marginBottom: 20,
    marginLeft: 15,
    fontFamily: FONT.medium,
    fontSize: 20,
    lineHeight: 28,
    color: '#000000',
    includeFontPadding: false,
  },
  row: { flexDirection: 'row' },

  badge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    height: 18,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FONT.medium,
    fontSize: 10,
    lineHeight: 14,
    color: '#DCDCDC',
    includeFontPadding: false,
  },
});

export default GalleryViewScreen;
