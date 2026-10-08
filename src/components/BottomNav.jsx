import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const GREY = '#808080';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

/**
 * Tabs of the bottom bar.
 * `route` = the screen name in AppNavigator (Home has no screen yet).
 */
const TABS = [
  { key: 'Home', label: 'Home', icon: ICONS.home, route: null },
  { key: 'Favorites', label: 'Favorites', icon: require('../assets/icons/NavHeart.png'), route: 'FavoritesScreen' },
  { key: 'Explore', label: 'Explore', icon: ICONS.search, activeIcon: require('../assets/icons/SearchActive.png'), route: 'PropertyListingScreen' },
  { key: 'Profile', label: 'Profile', icon: ICONS.user, route: 'ProfileScreen' },
];

/* Figma: icons 30 (the active one 34), label 12 / 400 (active 500), gap 4 */
const NavItem = ({ tab, isActive, onPress }) => {
  const size = isActive ? 34 : 30;
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
        style={{ width: size, height: size, tintColor: isActive ? ORANGE : GREY }}
        resizeMode="contain"
      />
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Figma navbar (375 x 74): padding 12 / 24, shadow 0 -2 6 rgba(0,0,0,.1).
 * Props: active ('Home' | 'Favorites' | 'Explore' | 'Profile' | ''), navigation.
 */
const BottomNav = ({ active = 'Explore', navigation }) => {
  const handlePress = (tab) => {
    if (tab.key === active || !tab.route) return;
    navigation?.navigate(tab.route);
  };

  return (
    <View style={styles.wrap}>
      {/* soft shadow above the bar: 0 -2 6 rgba(0,0,0,.1) */}
      <View pointerEvents="none" style={[styles.shade, { top: -6, backgroundColor: 'rgba(0,0,0,0.015)' }]} />
      <View pointerEvents="none" style={[styles.shade, { top: -4, backgroundColor: 'rgba(0,0,0,0.03)' }]} />
      <View pointerEvents="none" style={[styles.shade, { top: -2, backgroundColor: 'rgba(0,0,0,0.05)' }]} />

      <View style={styles.bottomNav}>
        {TABS.map((tab) => (
          <NavItem
            key={tab.key}
            tab={tab}
            isActive={tab.key === active}
            onPress={() => handlePress(tab)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#FFFFFF' },
  shade: { position: 'absolute', left: 0, right: 0, height: 2 },
  bottomNav: {
    height: 74,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 12,
    includeFontPadding: false,
  },
  labelInactive: { fontFamily: FONT.regular, color: GREY },
  labelActive: { fontFamily: FONT.medium, color: ORANGE },
});

export default BottomNav;
