import React from 'react';
import { View, Text, FlatList, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import ScreenHeader from '../components/ScreenHeader';
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title="Favorites" onBack={() => navigation.goBack()} />

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FavoriteCard item={item} onToggleFavorite={toggleFavorite} onPress={openProperty} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  // header ends at 52 -> first card at 76 (Figma 120 - 44); last card 40px above navbar
  listContent: { paddingTop: 24, paddingBottom: 40 },
  separator: { height: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyHeart: { fontSize: 44, color: '#FF6C40', marginBottom: 8 },
  emptyTitle: { fontFamily: FONT.semibold, fontSize: 15, color: TEXT, marginBottom: 4 },
  emptyText: { fontFamily: FONT.regular, fontSize: 11, color: '#8A8A8A', textAlign: 'center' },
});
