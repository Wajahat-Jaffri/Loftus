import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import FavoriteCard from '../components/FavoriteCard';
import { useFavorites } from '../context/FavoritesContext';

const TEXT = '#1C1C1C';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const FavoritesScreen = ({ navigation }) => {
  const { favorites, toggleFavorite } = useFavorites();

  const openProperty = (item) => {
    // Adjust the param name if your PropertyDetailsScreen expects something else.
    navigation.navigate('PropertyDetailsScreen', { property: item });
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
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.headerBtn} />
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FavoriteCard item={item} onToggleFavorite={toggleFavorite} onPress={openProperty} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, favorites.length === 0 && { flexGrow: 1 }]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyHeart}>♡</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart on any property and it will show up here.
            </Text>
          </View>
        }
      />

      <BottomNav active="Favorites" navigation={navigation} />
    </SafeAreaView>
  );
};

export default FavoritesScreen;

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
  listContent: { paddingTop: 12, paddingBottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyHeart: { fontSize: 44, color: '#FF6C40', marginBottom: 8 },
  emptyTitle: { fontFamily: FONT.semibold, fontSize: 15, color: TEXT, marginBottom: 4 },
  emptyText: { fontFamily: FONT.regular, fontSize: 11, color: '#8A8A8A', textAlign: 'center' },
});
