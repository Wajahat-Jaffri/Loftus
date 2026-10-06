import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICONS } from '../assets';
import { PROPERTIES } from '../constants/dummyData';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const BORDER = '#EAEAEA';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const { width: W } = Dimensions.get('window');
const CARD_W = W - 32;
const IMAGE_H = 150;

const TABS = ['Active', 'Pending'];

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    {icon ? <Image source={icon} style={styles.featureIcon} resizeMode="contain" /> : null}
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

/** One property card: swipeable photos, name, details, address. */
const PropertyItem = ({ item, onPress }) => {
  const images = item.images?.length ? item.images : [];
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const handleScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    if (i !== indexRef.current && i >= 0 && i < images.length) {
      indexRef.current = i;
      setIndex(i);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <FlatList
          data={images}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          getItemLayout={(_, i) => ({ length: CARD_W, offset: CARD_W * i, index: i })}
          renderItem={({ item: img }) => (
            <TouchableOpacity activeOpacity={0.95} onPress={() => onPress(item)}>
              <Image source={img} style={styles.image} />
            </TouchableOpacity>
          )}
        />
        {images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === index ? styles.dotOn : styles.dotOff]} />
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.85} style={styles.details} onPress={() => onPress(item)}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.featuresRow}>
          <Feature icon={ICONS.bed} label={item.beds} />
          <View style={styles.divider} />
          <Feature icon={ICONS.bath} label={item.baths} />
          <View style={styles.divider} />
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Properties</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {data.length === 0 ? (
          <Text style={styles.empty}>No {tab.toLowerCase()} properties yet.</Text>
        ) : (
          data.map((p) => <PropertyItem key={String(p.id)} item={p} onPress={openProperty} />)
        )}
      </ScrollView>

      {/* + : add a new property */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => navigation.navigate('AddPropertyScreen')}
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PropertiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 14, color: TEXT },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },

  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabActive: { borderBottomColor: ORANGE },
  tabText: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
  tabTextActive: { fontFamily: FONT.medium, color: ORANGE },

  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 90 },
  empty: { fontFamily: FONT.regular, fontSize: 11, color: '#8A8A8A', textAlign: 'center', marginTop: 40 },

  card: {
    width: CARD_W,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    overflow: 'hidden',
  },
  imageWrap: { width: CARD_W - 2, height: IMAGE_H },
  image: { width: CARD_W - 2, height: IMAGE_H, resizeMode: 'cover' },
  dots: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: { width: 5, height: 5, borderRadius: 3, marginHorizontal: 2 },
  dotOn: { backgroundColor: ORANGE },
  dotOff: { backgroundColor: '#FFFFFF' },

  details: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  title: { fontFamily: FONT.semibold, fontSize: 11, color: '#000000', marginBottom: 4 },
  featuresRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 9, height: 9, tintColor: '#8A8A8A', marginRight: 3 },
  featureText: { fontFamily: FONT.regular, fontSize: 7, color: '#6B6B6B' },
  divider: { width: 1, height: 8, backgroundColor: '#D1D1D1', marginHorizontal: 6 },
  address: { fontFamily: FONT.regular, fontSize: 7, color: '#6B6B6B' },

  fab: {
    position: 'absolute',
    right: 18,
    bottom: 28,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabPlus: { color: '#FFFFFF', fontSize: 26, lineHeight: 30, fontFamily: FONT.regular },
});
