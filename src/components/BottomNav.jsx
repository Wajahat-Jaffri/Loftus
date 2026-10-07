import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ICONS, IMAGES } from '../assets';

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
  { key: 'Explore', label: 'Explore', icon: ICONS.search, route: 'PropertyListingScreen' },
  { key: 'Profile', label: 'Profile', icon: null, avatar: true, route: 'ProfileScreen' },
];

const NavItem = ({ tab, isActive, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
    {tab.avatar ? (
      <Image source={IMAGES.profile} style={styles.avatar} />
    ) : (
      <Image
        source={tab.icon}
        style={[styles.icon, { tintColor: isActive ? ORANGE : GREY }]}
        resizeMode="contain"
      />
    )}
    <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
      {tab.label}
    </Text>
  </TouchableOpacity>
);

/**
 * Figma navbar (375 x 70): padding 12 / 24, icons 30, labels 12, gap 4.
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
  wrap: {
    backgroundColor: '#FFFFFF',
  },
  shade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  bottomNav: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    height: 48,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 14,
    includeFontPadding: false,
  },
  labelInactive: {
    fontFamily: FONT.regular,
    color: GREY,
  },
  labelActive: {
    fontFamily: FONT.medium,
    color: ORANGE,
  },
});

export default BottomNav;
