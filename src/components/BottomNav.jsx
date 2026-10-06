import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const GREY = '#9E9E9E';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

/**
 * Tabs of the bottom bar.
 * `route` = the screen name in AppNavigator.
 * Home has no screen yet, so it stays null (tapping it does nothing).
 */
const TABS = [
  { key: 'Home', label: 'Home', icon: ICONS.home, fallback: '⌂', route: null },
  { key: 'Favorites', label: 'Favorites', icon: ICONS.heart, route: 'FavoritesScreen' },
  { key: 'Explore', label: 'Explore', icon: ICONS.search, route: 'PropertyListingScreen' },
  { key: 'Profile', label: 'Profile', icon: ICONS.user, route: 'ProfileScreen' },
];

const NavItem = ({ tab, isActive, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
    {tab.icon ? (
      <Image
        source={tab.icon}
        style={[styles.icon, { tintColor: isActive ? ORANGE : GREY }]}
        resizeMode="contain"
      />
    ) : (
      <Text style={[styles.fallbackIcon, isActive && { color: ORANGE }]}>
        {tab.fallback}
      </Text>
    )}
    <Text style={isActive ? styles.labelActive : styles.labelInactive}>
      {tab.label}
    </Text>
  </TouchableOpacity>
);

/**
 * Shared bottom tab bar.
 *
 * Props:
 *  - active: the tab that belongs to the screen showing this bar
 *            ('Home' | 'Favorites' | 'Explore' | 'Profile'). That tab is orange.
 *  - navigation: React Navigation object.
 *
 * Every screen with this bar passes its own `active`, so the orange tab
 * always matches the screen you are on.
 */
const BottomNav = ({ active = 'Explore', navigation }) => {
  const handlePress = (tab) => {
    // Already on this tab, or the tab has no screen yet.
    if (tab.key === active || !tab.route) return;
    navigation?.navigate(tab.route);
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 62,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  icon: {
    width: 22,
    height: 22,
    marginBottom: 3,
  },
  fallbackIcon: {
    fontSize: 20,
    lineHeight: 24,
    color: GREY,
    marginBottom: 1,
  },
  labelInactive: {
    fontFamily: FONT.regular,
    fontSize: 9,
    color: GREY,
  },
  labelActive: {
    fontFamily: FONT.medium,
    fontSize: 9,
    color: ORANGE,
  },
});

export default BottomNav;
