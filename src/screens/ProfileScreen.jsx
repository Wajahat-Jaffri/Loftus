import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { ICONS, IMAGES } from '../assets';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const BORDER = '#E6E6E6';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};

// `route` = screen name in AppNavigator. Screens that don't exist yet are skipped safely.
const PROPERTY_MANAGEMENT = [
  { label: 'Properties', icon: ICONS.buildingOffice, route: 'Properties' },
  { label: 'Listings', icon: ICONS.listBullets, route: 'PropertyListingScreen' },
  { label: 'Favorites', icon: ICONS.heartLine, route: 'Favorites' },
  { label: 'Payments', icon: ICONS.money, route: 'PaymentsScreen' },
  { label: 'Offers', icon: ICONS.moneyWavy, route: 'Offers' },
  { label: 'Leases', icon: ICONS.lease, route: 'Leases' },
  { label: 'Service Staff', icon: ICONS.serviceStaff, route: 'ServiceStaff' },
  { label: 'Service Requests', icon: ICONS.shield, route: 'ServiceRequests' },
];

const ACCOUNT_SETTINGS = [
  { label: 'Service Profile', icon: ICONS.briefcase, route: 'ServiceProfile' },
  { label: 'Analytics', icon: ICONS.chartLineUp, route: 'Analytics' },
  { label: 'Payment Methods', icon: ICONS.cardholder, route: 'PaymentMethods' },
];

const MenuGroup = ({ items, onPress }) => (
  <View style={styles.group}>
    {items.map((item, index) => (
      <TouchableOpacity
        key={item.label}
        activeOpacity={0.7}
        style={[styles.row, index !== items.length - 1 && styles.rowDivider]}
        onPress={() => onPress(item)}
      >
        <Image source={item.icon} style={styles.rowIcon} resizeMode="contain" />
        <Text style={styles.rowLabel}>{item.label}</Text>
        <View style={styles.chevron} />
      </TouchableOpacity>
    ))}
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const handleItemPress = (item) => {
    const routes = navigation.getState()?.routeNames || [];
    if (routes.includes(item.route)) {
      navigation.navigate(item.route);
    }
  };

  const handleSignOut = () => {
    // TODO: clear auth token / user data here
    navigation.reset({ index: 0, routes: [{ name: 'SignInScreen' }] });
  };

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
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('EditProfileScreen')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={ICONS.notePencil} style={styles.editIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.userCard}>
          <Image source={IMAGES.profile} style={styles.avatar} />
          <Text style={styles.userName}>Jerry Helfer</Text>
        </View>

        <Text style={styles.sectionTitle}>Property Management</Text>
        <MenuGroup items={PROPERTY_MANAGEMENT} onPress={handleItemPress} />

        <Text style={styles.sectionTitle}>Account Settings</Text>
        <MenuGroup items={ACCOUNT_SETTINGS} onPress={handleItemPress} />

        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8} onPress={handleSignOut}>
          <Image source={ICONS.signOut} style={styles.signOutIcon} resizeMode="contain" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="Profile" navigation={navigation} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
  headerTitle: { fontFamily: FONT.medium, fontSize: 15, color: TEXT },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  editIcon: { width: 22, height: 22 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  userName: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONT.semi,
    fontSize: 15,
    color: TEXT,
    marginRight: 72,
  },
  sectionTitle: {
    fontFamily: FONT.semi,
    fontSize: 14,
    color: TEXT,
    marginTop: 20,
    marginBottom: 10,
  },
  group: { borderWidth: 1, borderColor: BORDER, borderRadius: 10, backgroundColor: '#FFFFFF' },
  row: { height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: BORDER },
  rowIcon: { width: 18, height: 18, marginRight: 12 },
  rowLabel: { flex: 1, fontFamily: FONT.regular, fontSize: 12, color: TEXT },
  chevron: {
    width: 7,
    height: 7,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
  },
  signOutBtn: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  signOutIcon: { width: 18, height: 18, marginRight: 8 },
  signOutText: { fontFamily: FONT.medium, fontSize: 13, color: ORANGE },
});
