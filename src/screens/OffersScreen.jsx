import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfferCard from '../components/offers/OfferCard';
import RoleToggle from '../components/offers/RoleToggle';
import OfferFilterModal from '../components/offers/OfferFilterModal';
import { COLORS, FONT, BackArrow } from '../components/listing/ListingControls';
import { OFFERS, CATEGORIES } from '../constants/offersData';

const Tab = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.tab} activeOpacity={0.7} onPress={onPress}>
    <Text style={[styles.tabText, selected && styles.tabTextActive]}>{label}</Text>
    <View style={[styles.tabLine, selected && styles.tabLineActive]} />
  </TouchableOpacity>
);

const OffersScreen = ({ navigation }) => {
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers</Text>
        <View style={styles.headerBtn} />
      </View>

      {/* Tabs + toggle + filter */}
      <View style={styles.tabsRow}>
        <View style={styles.tabsLeft}>
          <Tab label="Pending" selected={tab === 'pending'} onPress={() => setTab('pending')} />
          <Tab label="Declined" selected={tab === 'declined'} onPress={() => setTab('declined')} />
        </View>

        <View style={styles.tabsRight}>
          <RoleToggle value={role} onChange={setRole} />
          <TouchableOpacity
            style={styles.filterBtn}
            activeOpacity={0.7}
            onPress={() => setFilterOpen(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={[styles.filterLine, { width: 30 }]} />
            <View style={[styles.filterLine, { width: 21 }]} />
            <View style={[styles.filterLine, { width: 12 }]} />
            {filterActive && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Category pills */}
      <View style={styles.pillsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((c) => {
            const selected = category === c;
            return (
              <TouchableOpacity
                key={c}
                activeOpacity={0.8}
                onPress={() => setCategory(c)}
                style={[styles.pill, selected && styles.pillOn]}
              >
                <Text style={[styles.pillText, selected && styles.pillTextOn]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 19, color: COLORS.text },

  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsLeft: { flexDirection: 'row' },
  tab: { paddingHorizontal: 16, paddingTop: 12 },
  tabText: { fontFamily: FONT.regular, fontSize: 14, color: COLORS.text, paddingBottom: 14 },
  tabTextActive: { fontFamily: FONT.medium, color: COLORS.orange },
  tabLine: { height: 2, backgroundColor: 'transparent' },
  tabLineActive: { backgroundColor: COLORS.orange },
  tabsRight: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10 },
  filterBtn: {
    width: 32,
    height: 32,
    marginLeft: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  filterLine: { height: 3, borderRadius: 2, backgroundColor: COLORS.orange, marginVertical: 2.5 },
  filterDot: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },

  pillsWrap: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 34 },
  pill: {
    height: 32,
    minWidth: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.orange,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOn: { backgroundColor: COLORS.orange },
  pillText: { fontFamily: FONT.medium, fontSize: 13, color: COLORS.orange },
  pillTextOn: { color: '#FFFFFF' },

  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default OffersScreen;
