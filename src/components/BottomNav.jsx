import React, { useEffect, useState } from 'react';
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
 * `route` = screen name in AppNavigator. Leave it null until that screen exists;
 * the tab will still turn orange when tapped, it just won't navigate anywhere.
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

const BottomNav = ({ active = 'Explore', navigation }) => {
  const [selected, setSelected] = useState(active);

  useEffect(() => {
    setSelected(active);
  }, [active]);

  const handlePress = (tab) => {
    setSelected(tab.key);
    if (tab.route && tab.key !== active) {
      navigation?.navigate(tab.route);
    }
  };

  return (
    <View style={styles.bottomNav}>
      {TABS.map((tab) => (
        <NavItem
          key={tab.key}
          tab={tab}
          isActive={selected === tab.key}
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
  navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 60 },
  icon: { width: 22, height: 22, marginBottom: 3 },
  fallbackIcon: { fontSize: 20, lineHeight: 24, color: GREY, marginBottom: 1 },
  labelInactive: { fontFamily: FONT.regular, fontSize: 9, color: GREY },
  labelActive: { fontFamily: FONT.medium, fontSize: 9, color: ORANGE },
});

export default BottomNav;
