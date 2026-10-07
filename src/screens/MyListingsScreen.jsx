import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import ListingCard from '../components/listing/ListingCard';
import CreateListingModal from '../components/listing/CreateListingModal';
import { COLORS, FONT } from '../components/listing/ListingControls';
import { MY_LISTINGS } from '../constants/listingData';

const PLUS = require('../assets/icons/PropPlus.png');

const MyListingsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('active');
  const [showCreate, setShowCreate] = useState(false);
  const [listings, setListings] = useState(MY_LISTINGS);

  // A listing finished in the Create Listing wizard arrives here as a param.
  const incoming = route?.params?.newListing;
  useEffect(() => {
    if (incoming) {
      setListings((list) => (list.some((l) => l.id === incoming.id) ? list : [incoming, ...list]));
      setTab('active');
      navigation.setParams({ newListing: undefined });
    }
  }, [incoming, navigation]);

  const activeList = listings.filter((l) => l.status === 'active');
  const expiredList = listings.filter((l) => l.status === 'expired');
  const data = tab === 'active' ? activeList : expiredList;

  const handleSelectType = (type, property) => {
    setShowCreate(false);
    const screen = type === 'Rent' ? 'CreateRentalListingScreen' : 'CreateListingScreen';
    // wait for the modal to close, then navigate (smooth on Android)
    setTimeout(() => {
      navigation.navigate(screen, { type, property });
    }, 250);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title="Listing" onBack={() => navigation.goBack()} />

      {/* Segmented control: 163 x 50, two tabs of 81.5, 2px orange underline on the active one */}
      <View style={styles.segmentRow}>
        <View style={styles.segment}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tab, tab === 'active' && styles.tabOn]}
            onPress={() => setTab('active')}
          >
            <Text style={tab === 'active' ? styles.tabTextOn : styles.tabText}>
              {`Active (${activeList.length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.tab, tab === 'expired' && styles.tabOn]}
            onPress={() => setTab('expired')}
          >
            <Text style={tab === 'expired' ? styles.tabTextOn : styles.tabText}>Expired</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
        ListEmptyComponent={<Text style={styles.empty}>No listings found</Text>}
      />

      {/* + : create a listing (Figma: 50 x 50, right 15, 54 above the bottom edge) */}
      <TouchableOpacity activeOpacity={0.85} style={styles.fab} onPress={() => setShowCreate(true)}>
        <Image source={PLUS} style={styles.fabPlus} resizeMode="contain" />
      </TouchableOpacity>

      <CreateListingModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSelectType={handleSelectType}
      />
    </SafeAreaView>
  );
};

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
  tabOn: { borderBottomWidth: 2, borderBottomColor: COLORS.orange },
  tabText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.22,
    color: '#515151',
    includeFontPadding: false,
  },
  tabTextOn: {
    fontFamily: FONT.semi,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.22,
    color: COLORS.orange,
    includeFontPadding: false,
  },

  /* first card at Figma y 186 => 37px under the control */
  list: { flex: 1 },
  listContent: { paddingTop: 37, paddingHorizontal: 15 },
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
    bottom: 54,
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
  fabPlus: { width: 22.4, height: 22.4, tintColor: '#FFFFFF' },
});

export default MyListingsScreen;
