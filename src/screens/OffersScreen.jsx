import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import OfferCard from '../components/offers/OfferCard';
import RoleToggle from '../components/offers/RoleToggle';
import OfferFilterModal from '../components/offers/OfferFilterModal';
import { COLORS, FONT } from '../components/listing/ListingControls';
import { OFFERS, CATEGORIES } from '../constants/offersData';

/* Pending / Declined: 69 x 50 and 68 x 50, 2px orange underline on the active one */
const Tab = ({ label, selected, width, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, { width }, selected && styles.tabOn]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <Text style={selected ? styles.tabTextOn : styles.tabText}>{label}</Text>
  </TouchableOpacity>
);

const OffersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('pending');
  const [role, setRole] = useState('landlord');
  const [category, setCategory] = useState('All');
  const [propertyType, setPropertyType] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const data = OFFERS.filter((o) => {
    if (o.role !== role) return false;
    const inTab = tab === 'declined' ? o.status === 'declined' : o.status !== 'declined';
    if (!inTab) return false;
    if (category !== 'All' && o.type !== category) return false;
    if (propertyType !== 'All' && o.propertyType !== propertyType) return false;
    return true;
  });

  const filterActive = propertyType !== 'All';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title="Offers" onBack={() => navigation.goBack()} />

      {/* Figma row: 344 x 50 at x 16 — tabs (137) on the left, toggle + filter (133) on the right */}
      <View style={styles.tabsRow}>
        <View style={styles.tabsLeft}>
          <Tab label="Pending" width={69} selected={tab === 'pending'} onPress={() => setTab('pending')} />
          <Tab label="Declined" width={68} selected={tab === 'declined'} onPress={() => setTab('declined')} />
        </View>

        <View style={styles.tabsRight}>
          <RoleToggle value={role} onChange={setRole} />
          <TouchableOpacity
            style={styles.filterBtn}
            activeOpacity={0.7}
            onPress={() => setFilterOpen(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {/* ion:filter: 24 wide, 3 bars 24 / 16 / 6.4 */}
            <View style={[styles.filterLine, { width: 24 }]} />
            <View style={[styles.filterLine, { width: 16 }]} />
            <View style={[styles.filterLine, { width: 6.4 }]} />
            {filterActive && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Category chips: top 162, left 15, 27 high, 8 apart */}
      <View style={styles.chipsRow}>
        {CATEGORIES.map((c) => {
          const selected = category === c;
          return (
            <TouchableOpacity
              key={c}
              activeOpacity={0.8}
              onPress={() => setCategory(c)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* first card at Figma y 219 => 30px under the chips */}
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OfferCard
            item={item}
            onPress={(o) => navigation.navigate('OfferDetailsScreen', { offerId: o.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 + insets.bottom }]}
        ListEmptyComponent={<Text style={styles.empty}>No offers found</Text>}
      />

      <OfferFilterModal
        visible={filterOpen}
        value={propertyType}
        onClose={() => setFilterOpen(false)}
        onSelect={setPropertyType}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  tabsRow: {
    height: 50,
    marginLeft: 16,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsLeft: { flexDirection: 'row', height: 50 },
  tab: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabOn: { borderBottomWidth: 2, borderBottomColor: COLORS.orange },
  tabText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#515151',
    includeFontPadding: false,
  },
  tabTextOn: {
    fontFamily: FONT.semi,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.orange,
    includeFontPadding: false,
  },
  tabsRight: { flexDirection: 'row', alignItems: 'center', height: 34 },
  filterBtn: {
    width: 38,
    height: 34,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLine: { height: 2.5, borderRadius: 2, backgroundColor: COLORS.orange, marginVertical: 1.5 },
  filterDot: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },

  chipsRow: { marginTop: 16, marginLeft: 15, flexDirection: 'row' },
  chip: {
    height: 27,
    paddingHorizontal: 15, // Figma 16 minus the border
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.orange,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: COLORS.orange },
  chipText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 11,
    color: COLORS.orange,
    includeFontPadding: false,
  },
  chipTextOn: { color: '#FFFFFF' },

  list: { flex: 1 },
  listContent: { paddingTop: 30, paddingHorizontal: 15 },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default OffersScreen;
