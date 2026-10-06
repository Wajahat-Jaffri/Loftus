import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingCard from '../components/listing/ListingCard';
import CreateListingModal from '../components/listing/CreateListingModal';
import { COLORS, FONT, BackArrow } from '../components/listing/ListingControls';
import { MY_LISTINGS } from '../constants/listingData';

const Tab = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.tab} activeOpacity={0.7} onPress={onPress}>
    <Text style={[styles.tabText, selected && styles.tabTextActive]}>{label}</Text>
    <View style={[styles.tabLine, selected && styles.tabLineActive]} />
  </TouchableOpacity>
);

const MyListingsScreen = ({ navigation }) => {
  const [tab, setTab] = useState('active');
  const [showCreate, setShowCreate] = useState(false);

  const activeList = MY_LISTINGS.filter((l) => l.status === 'active');
  const expiredList = MY_LISTINGS.filter((l) => l.status === 'expired');
  const data = tab === 'active' ? activeList : expiredList;

  const handleSelectType = (type, property) => {
    setShowCreate(false);
    const screen = type === 'Rent' ? 'CreateRentalListingScreen' : 'CreateListingScreen';
    // Modal band hone ka wait, phir navigate (Android par smooth rehta hai)
    setTimeout(() => {
      navigation.navigate(screen, { type, property });
    }, 250);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.tabsRow}>
        <Tab
          label={`Active (${activeList.length})`}
          selected={tab === 'active'}
          onPress={() => setTab('active')}
        />
        <Tab label="Expired" selected={tab === 'expired'} onPress={() => setTab('expired')} />
      </View>

      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No listings found</Text>}
      />

      {/* + button */}
      <View style={styles.fabWrap} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => setShowCreate(true)}
        >
          <View style={styles.plusH} />
          <View style={styles.plusV} />
        </TouchableOpacity>
      </View>

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
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 15, color: COLORS.text },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 14,
  },
  tab: { marginRight: 22, paddingTop: 6 },
  tabText: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.grey, paddingBottom: 8 },
  tabTextActive: { fontFamily: FONT.medium, color: COLORS.orange },
  tabLine: { height: 2, backgroundColor: 'transparent' },
  tabLineActive: { backgroundColor: COLORS.orange },

  list: { flex: 1 },
  listContent: { paddingBottom: 100 },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.grey,
  },

  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 20,
    elevation: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  plusH: {
    position: 'absolute',
    width: 18,
    height: 2.2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  plusV: {
    position: 'absolute',
    width: 2.2,
    height: 18,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default MyListingsScreen;