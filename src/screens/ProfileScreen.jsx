import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import ScreenHeader from '../components/ScreenHeader';
import { ICONS, IMAGES } from '../assets';

const ORANGE = '#FF6C40';
const RED = '#E62626';
const BORDER = '#E9E9E9';
const INK = '#111827';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};

// `route` = screen name in AppNavigator. Screens that don't exist yet are skipped safely.
const PROPERTY_MANAGEMENT = [
  { label: 'Properties', icon: ICONS.buildingOffice, route: 'Properties' },
  { label: 'Listings', icon: ICONS.listBullets, route: 'Listings' },
  { label: 'Favorites', icon: ICONS.heartLine, route: 'FavoritesScreen' },
  { label: 'Payments', icon: ICONS.cardholder, route: 'PaymentsScreen' },
  { label: 'Offers', icon: ICONS.moneyWavy, route: 'Offers' },
  { label: 'Leases', icon: ICONS.lease, route: 'Leases' },
  { label: 'Service Staff', icon: ICONS.serviceStaff, route: 'ServiceStaff' },
  { label: 'Service Requests', icon: ICONS.shield, route: 'ServiceRequests' },
];

const ACCOUNT_SETTINGS = [
  { label: 'Service Profile', icon: ICONS.briefcase, route: 'ServiceProfile' },
  { label: 'Analytics', icon: ICONS.chartLineUp, route: 'Analytics' },
  { label: 'Payment Methods', icon: ICONS.money, route: 'PaymentMethods' },
];

const Chevron = () => (
  <View style={styles.chevBox}>
    <View style={styles.chev} />
  </View>
);

const MenuGroup = ({ items, onPress }) => (
  <View style={styles.group}>
    {items.map((item, index) => {
      const first = index === 0;
      const last = index === items.length - 1;
      return (
        <TouchableOpacity
          key={item.label}
          activeOpacity={0.7}
          style={[
            styles.row,
            first && styles.rowFirst,
            last && styles.rowLast,
          ]}
          onPress={() => onPress(item)}
        >
          <View style={styles.rowLeft}>
            <Image source={item.icon} style={styles.rowIcon} resizeMode="contain" />
            <Text style={styles.rowLabel}>{item.label}</Text>
          </View>
          <Chevron />
        </TouchableOpacity>
      );
    })}
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader
        title="Profile"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.headerRight}
            onPress={() => navigation.navigate('EditProfileScreen')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={ICONS.notePencil} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User card: 343 x 164, padding 16, gap 32 */}
        <View style={styles.userCard}>
          <Image source={IMAGES.profile} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Jerry Helfer</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Management</Text>
          <MenuGroup items={PROPERTY_MANAGEMENT} onPress={handleItemPress} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <MenuGroup items={ACCOUNT_SETTINGS} onPress={handleItemPress} />
        </View>

        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8} onPress={handleSignOut}>
          <Image source={ICONS.signOut} style={styles.signOutIcon} resizeMode="contain" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="" navigation={navigation} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  headerRight: { position: 'relative', top: 1, right: 1 },
  headerIcon: { width: 24, height: 24 },

  scrollContent: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 41 },

  userCard: {
    height: 164,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 15,
  },
  avatar: { width: 132, height: 132, borderRadius: 66 },
  userInfo: { flex: 1, marginLeft: 32 },
  userName: {
    fontFamily: FONT.semi,
    fontSize: 20,
    lineHeight: 30,
    color: '#000000',
    includeFontPadding: false,
  },

  section: { marginTop: 16 },
  sectionTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 10,
    includeFontPadding: false,
  },

  group: { width: 343 },
  row: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
  },
  rowFirst: { borderTopWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  rowLast: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { width: 20, height: 20, marginRight: 8, tintColor: INK },
  rowLabel: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: INK,
    includeFontPadding: false,
  },

  // ChevronRight 20 x 20: arrow is 6 wide x 10 tall, centred
  chevBox: { width: 20, height: 20 },
  chev: {
    position: 'absolute',
    left: 4.5,
    top: 6.5,
    width: 7,
    height: 7,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: INK,
    transform: [{ rotate: '45deg' }],
  },

  signOutBtn: {
    width: 345,
    height: 50,
    alignSelf: 'center',
    marginTop: 41,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E52626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutIcon: { width: 20, height: 20, marginRight: 10, tintColor: RED },
  signOutText: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: RED,
    includeFontPadding: false,
  },
});
