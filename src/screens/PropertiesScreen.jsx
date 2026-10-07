import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ICONS } from '../assets';
import ScreenHeader from '../components/ScreenHeader';
import { PROPERTIES } from '../constants/dummyData';

const ORANGE = '#FF6C40';
const CARD_BORDER = 'rgba(133, 135, 138, 0.3)';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const PLUS = require('../assets/icons/PropPlus.png');
const TABS = ['Active', 'Pending'];

/* bed / bath / sqft item: icon 16 + 2px + text 11/500 */
const Feature = ({ icon, label }) => (
  <View style={styles.feature}>
    {icon ? <Image source={icon} style={styles.featureIcon} resizeMode="contain" /> : null}
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

/* thin 9px vertical divider (the Figma line is a rotated 9px box) */
const Divider = () => (
  <View style={styles.dividerBox}>
    <View style={styles.dividerLine} />
  </View>
);

/**
 * One property card (Figma: 345 x 300, radius 12, no top border).
 * Picture 215 high with swipeable photos + dots, text block 8px from the left.
 */
const PropertyItem = ({ item, onPress }) => {
  const images = item.images?.length ? item.images : [];
  const [index, setIndex] = useState(0);
  const [pw, setPw] = useState(0);

  const onScroll = (e) => {
    if (!pw) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / pw);
    if (i !== index && i >= 0 && i < images.length) setIndex(i);
  };

  return (
    <View style={styles.card}>
      <View style={styles.picture} onLayout={(e) => setPw(e.nativeEvent.layout.width - 2)}>
        {pw > 0 && (
          <FlatList
            data={images}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            getItemLayout={(_, i) => ({ length: pw, offset: pw * i, index: i })}
            renderItem={({ item: img }) => (
              <TouchableOpacity activeOpacity={0.95} onPress={() => onPress(item)}>
                <Image source={img} style={{ width: pw, height: 213 }} resizeMode="cover" />
              </TouchableOpacity>
            )}
          />
        )}
        {images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === index ? styles.dotOn : styles.dotOff]} />
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.85} style={styles.info} onPress={() => onPress(item)}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.featuresRow}>
          <Feature icon={ICONS.bed} label={item.beds} />
          <Divider />
          <Feature icon={ICONS.bath} label={item.baths} />
          <Divider />
          <Feature icon={ICONS.area} label={item.sqft} />
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const PropertiesScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('Active');
  const [active] = useState(PROPERTIES);
  const [pending, setPending] = useState([]);

  // A property finished in "Add Property" arrives here and waits in Pending.
  const incoming = route?.params?.newProperty;
  useEffect(() => {
    if (incoming) {
      setPending((list) => (list.some((p) => p.id === incoming.id) ? list : [incoming, ...list]));
      setTab('Pending');
      navigation.setParams({ newProperty: undefined });
    }
  }, [incoming, navigation]);

  const data = tab === 'Active' ? active : pending;

  const openProperty = (property) => navigation.navigate('PropertyPageScreen', { property });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title="Properties" onBack={() => navigation.goBack()} />

      {/* Segmented control: 163 x 50, two tabs of 81.5 */}
      <View style={styles.segmentRow}>
        <View style={styles.segment}>
          {TABS.map((t) => {
            const on = tab === t;
            return (
              <TouchableOpacity
                key={t}
                activeOpacity={0.8}
                style={[styles.tab, on && styles.tabOn]}
                onPress={() => setTab(t)}
              >
                <Text style={on ? styles.tabTextOn : styles.tabText}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 31 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {data.length === 0 ? (
          <Text style={styles.empty}>No {tab.toLowerCase()} properties yet.</Text>
        ) : (
          data.map((p, i) => (
            <View key={String(p.id)} style={i > 0 && styles.cardGap}>
              <PropertyItem item={p} onPress={openProperty} />
            </View>
          ))
        )}
      </ScrollView>

      {/* + : add a new property (Figma: 50 x 50, right 15, 54 above the bottom edge) */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => navigation.navigate('AddPropertyScreen')}
      >
        <Image source={PLUS} style={styles.fabPlus} resizeMode="contain" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PropertiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  /* segmented control (top 99 => 3px under the header) */
  segmentRow: { marginTop: 3, paddingHorizontal: 15, height: 50 },
  segment: { width: 163, height: 50, flexDirection: 'row' },
  tab: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabOn: { borderBottomWidth: 2, borderBottomColor: ORANGE },
  tabText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.22,
    color: '#515151',
    includeFontPadding: false,
  },
  tabTextOn: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.22,
    color: ORANGE,
    includeFontPadding: false,
  },

  /* list starts at Figma y 171 => 22px under the control */
  content: { paddingTop: 22, paddingHorizontal: 15 },
  cardGap: { marginTop: 24 },
  empty: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: 40,
  },

  /* card */
  card: {
    height: 300,
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
  },
  picture: {
    height: 215,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EDEDED',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { borderRadius: 5, marginHorizontal: 2 },
  dotOn: { width: 9, height: 9, backgroundColor: ORANGE },
  dotOff: { width: 7, height: 7, backgroundColor: '#FFFFFF' },

  /* text block: starts 8px under the picture, 8px from the left */
  info: { paddingLeft: 8 },
  title: {
    marginTop: 4.5,
    fontFamily: FONT.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    includeFontPadding: false,
  },
  featuresRow: { marginTop: 6.5, height: 16, flexDirection: 'row', alignItems: 'center' },
  feature: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 16, height: 16, tintColor: ORANGE, marginRight: 2 },
  featureText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  dividerBox: { width: 9, height: 16, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  dividerLine: { width: 1, height: 9, backgroundColor: '#4E4E4E', opacity: 0.5 },
  address: {
    marginTop: 10,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    includeFontPadding: false,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 15,
    bottom: 54,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  fabPlus: { width: 22.4, height: 22.4, tintColor: '#FFFFFF' },
});
