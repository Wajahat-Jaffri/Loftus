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
import ScreenHeader from '../components/ScreenHeader';
import LeaseCard from '../components/lease/LeaseCard';
import { LeaseCreateModal } from '../components/lease/LeaseModals';
import RoleToggle from '../components/offers/RoleToggle';
import OfferFilterModal from '../components/offers/OfferFilterModal';
import { COLORS, FONT } from '../components/listing/ListingControls';
import { LEASES, LEASE_TABS, USER_ROLES } from '../constants/leaseData';

const PLUS_PNG = require('../assets/icons/Plus.png');

const TAB_W = 68.25;
const TABS_VIEW_W = 205;
const FADE_FROM = TABS_VIEW_W * 0.578;
const FADE_STRIPS = 22;

/* Figma "Rectangle 4536": white fade over the right 42% of the tabs (linear-gradient 57.8% -> 100%) */
const TabsFade = () => {
  const w = (TABS_VIEW_W - FADE_FROM) / FADE_STRIPS;
  return (
    <View pointerEvents="none" style={styles.fade}>
      {Array.from({ length: FADE_STRIPS }).map((_, i) => (
        <View
          key={i}
          style={{
            width: w,
            height: 50,
            backgroundColor: '#FFFFFF',
            opacity: (i + 1) / FADE_STRIPS,
          }}
        />
      ))}
    </View>
  );
};

const Tab = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, selected && styles.tabOn]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <Text style={selected ? styles.tabTextOn : styles.tabText}>{label}</Text>
  </TouchableOpacity>
);

const LeasesScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('Active');
  /* two Figma frames:
     - user has both roles  => toggle + scrollable tabs (205 wide with a fade)
     - user has one role    => no toggle, the 4 tabs fill the row (273 wide)
     pass navigation.navigate('Leases', { roles: ['tenant'] }) to override USER_ROLES */
  const roles = route?.params?.roles || USER_ROLES;
  const hasToggle = roles.length > 1;
  const [role, setRole] = useState(roles[0]);
  const [propertyType, setPropertyType] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [, force] = useState(0);

  /* refresh when coming back from Create Lease (it adds to LEASES) */
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => force((n) => n + 1));
    return unsub;
  }, [navigation]);

  const data = LEASES.filter((l) => {
    if (l.role !== role) return false;
    if (l.status !== tab.toLowerCase()) return false;
    if (propertyType !== 'All' && l.propertyType !== propertyType) return false;
    return true;
  });

  const filterActive = propertyType !== 'All';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title="Leases" onBack={() => navigation.goBack()} />

      {/* Figma row: 344 x 50 at x 16 - scrollable tabs (205) on the left, toggle + filter (133) on the right */}
      <View style={styles.tabsRow}>
        {hasToggle ? (
          <View style={styles.tabsLeft}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ width: TAB_W * LEASE_TABS.length }}
            >
              {LEASE_TABS.map((t) => (
                <Tab key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />
              ))}
            </ScrollView>
            <TabsFade />
          </View>
        ) : (
          <View style={styles.tabsFull}>
            {LEASE_TABS.map((t) => (
              <Tab key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />
            ))}
          </View>
        )}

        <View style={styles.tabsRight}>
          {hasToggle ? <RoleToggle value={role} onChange={setRole} /> : null}
          <TouchableOpacity
            style={[styles.filterBtn, !hasToggle && { marginLeft: 0 }]}
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

      {/* first card at Figma y 162 => 16px under the tabs row */}
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeaseCard
            item={item}
            onPress={(l) => navigation.navigate('LeaseDetailsScreen', { leaseId: l.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
        ListEmptyComponent={<Text style={styles.empty}>No leases found</Text>}
      />

      {/* Figma FAB 50 x 50 at x 310 / y 723 => right 15, bottom 39 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setCreateOpen(true)}
      >
        <Image source={PLUS_PNG} style={styles.fabIcon} resizeMode="contain" />
      </TouchableOpacity>

      <OfferFilterModal
        visible={filterOpen}
        value={propertyType}
        onClose={() => setFilterOpen(false)}
        onSelect={setPropertyType}
      />

      <LeaseCreateModal
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={({ property, tenant }) => {
          setCreateOpen(false);
          navigation.navigate('CreateLeaseScreen', { property, tenant });
        }}
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
  tabsLeft: { width: TABS_VIEW_W, height: 50, overflow: 'hidden' },
  tabsFull: { width: TAB_W * LEASE_TABS.length, height: 50, flexDirection: 'row' },
  tab: {
    width: TAB_W,
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
  fade: {
    position: 'absolute',
    left: FADE_FROM,
    top: 0,
    height: 50,
    flexDirection: 'row',
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

  list: { flex: 1 },
  listContent: { paddingTop: 16, paddingHorizontal: 15 },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.grey,
  },

  fab: {
    position: 'absolute',
    right: 15,
    bottom: 39,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  fabIcon: { width: 16.8, height: 16.8, tintColor: '#FFFFFF' },
});

export default LeasesScreen;
